import admin from "@/config/firebase-admin";
import { estoqueRepository } from "@/repository/EstoqueRepository";

const db = admin.firestore();

/** Converte Date / Firestore Timestamp / ISO string → number (ms) */
function toTime(v: any): number {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  if (typeof v?.toDate === "function") return v.toDate().getTime(); // Timestamp
  return new Date(v).getTime();
}

/** Normaliza um movimento para algo 100% serializável */
function normalizeMovimento(m: any) {
  const criadoEm =
    m?.criadoEm?.toDate?.() ??
    (m?.criadoEm instanceof Date ? m.criadoEm : new Date(m?.criadoEm ?? Date.now()));

  return {
    id: String(m?.id ?? m?.__id ?? ""), // fireorm às vezes guarda id em __id
    produtoId: String(m?.produtoId),
    tipo: m?.tipo as "entrada" | "saida",
    quantidade: Number(m?.quantidade ?? 0),
    descricao: m?.descricao ?? "",
    criadoEm: criadoEm.toISOString(),
  };
}

export const estoqueService = {
  /**
   * Lista movimentos de estoque.
   * - Se houver produtoId, filtra por produto + ordena por criadoEm desc.
   * - Fallback se o Firestore exigir índice composto.
   */
  async listar(params: { produtoId?: string; limit?: number }) {
    const limit = params.limit ?? 20;

    try {
      if (params.produtoId) {
        // caminho “ideal” (requer índice composto se combinar where + orderBy)
        const data = await estoqueRepository
          .whereEqualTo("produtoId", params.produtoId)
          .orderByDescending("criadoEm")
          .limit(limit)
          .find();

        return data.map(normalizeMovimento);
      }

      const data = await estoqueRepository
        .orderByDescending("criadoEm")
        .limit(limit)
        .find();

      return data.map(normalizeMovimento);
    } catch (e: any) {
      // Fallback quando o Firestore pede índice composto
      if (String(e?.code) === "failed-precondition") {
        const base = params.produtoId
          ? await estoqueRepository
              .whereEqualTo("produtoId", params.produtoId)
              .limit(Math.max(limit, 100)) // pega mais e ordena em memória
              .find()
          : await estoqueRepository.limit(Math.max(limit, 100)).find();

        return base
          .sort((a: any, b: any) => toTime(b.criadoEm) - toTime(a.criadoEm))
          .slice(0, limit)
          .map(normalizeMovimento);
      }
      throw e;
    }
  },

  /**
   * Cria um movimento de estoque (entrada/saída) e atualiza o estoque do produto.
   * Usa transação para garantir consistência.
   */
  async criar(data: {
    produtoId: string;
    tipo: "entrada" | "saida";
    quantidade: number;
    descricao?: string;
  }) {
    const { produtoId, tipo } = data;
    const quantidade = Number(data.quantidade ?? 0);
    if (!produtoId) throw new Error("produtoId é obrigatório");
    if (!quantidade || quantidade <= 0) throw new Error("quantidade inválida");

    const produtoRef = db.collection("produtos").doc(produtoId);
    const movimentoRef = db.collection("movimentosEstoque").doc();
    const criadoEm = new Date();

    let novoEstoqueCalculado = 0;

    await db.runTransaction(async (tx) => {
      const prodSnap = await tx.get(produtoRef);
      if (!prodSnap.exists) throw new Error("Produto não encontrado");

      const produto = prodSnap.data() as any;
      const estoqueAtual = Number(produto?.estoque ?? 0);

      novoEstoqueCalculado =
        tipo === "entrada" ? estoqueAtual + quantidade : estoqueAtual - quantidade;

      if (novoEstoqueCalculado < 0) {
        throw new Error("Saída excede o estoque atual");
      }

      tx.update(produtoRef, {
        estoque: novoEstoqueCalculado,
        atualizadoEm: criadoEm,
      });

      tx.set(movimentoRef, {
        produtoId,
        tipo,
        quantidade,
        descricao:
          data.descricao || (tipo === "entrada" ? "Entrada manual" : "Saída manual"),
        criadoEm,
      });
    });

    // Retorna algo serializável (nada de Timestamp)
    return {
      ok: true,
      movimento: {
        id: movimentoRef.id,
        produtoId,
        tipo,
        quantidade,
        descricao:
          data.descricao || (tipo === "entrada" ? "Entrada manual" : "Saída manual"),
        criadoEm: criadoEm.toISOString(),
      },
      novoEstoque: novoEstoqueCalculado,
    };
  },
};
