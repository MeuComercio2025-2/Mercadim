import { NextResponse } from "next/server";
import admin from "@/config/firebase-admin";
import { movimentoEstoqueSchema } from "@/lib/schemas/EstoqueSchema";

const db = admin.firestore();

/** Converte o snapshot para JSON serializável e
 * garante que `criadoEm` sempre seja string ISO. */
function serialize(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = doc.data() as any;

  // quando vem como Timestamp, usamos .toDate()
  const created =
    data?.criadoEm?.toDate?.() instanceof Date
      ? data.criadoEm.toDate().toISOString()
      : typeof data?.criadoEm === "string"
      ? data.criadoEm
      : new Date().toISOString();

  return {
    id: doc.id,
    ...data,
    criadoEm: created,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const produtoId = searchParams.get("produtoId");
  const limitParam = Number(searchParams.get("limit") || 20);

  try {
    let query: FirebaseFirestore.Query = db
      .collection("movimentosEstoque")
      .orderBy("criadoEm", "desc");

    if (produtoId) {
      query = query.where("produtoId", "==", produtoId);
    }

    try {
      // Caminho principal (precisa de índice composto produtoId + criadoEm desc)
      const snap = await query.limit(limitParam).get();
      const items = snap.docs.map(serialize);
      return NextResponse.json(items);
    } catch (e: any) {
      // code === 9 => FAILED_PRECONDITION (índice necessário)
      if (e?.code === 9) {
        // Fallback: sem orderBy (não precisa índice), e ordena em memória
        let q2: FirebaseFirestore.Query = db.collection("movimentosEstoque");
        if (produtoId) q2 = q2.where("produtoId", "==", produtoId);
        const snap2 = await q2.limit(limitParam).get();
        const items2 = snap2.docs
          .map(serialize)
          .sort(
            (a: any, b: any) =>
              new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
          );
        return NextResponse.json(items2);
      }
      throw e;
    }
  } catch (e) {
    console.error("GET /api/estoque error:", e);
    return NextResponse.json({ error: "Erro ao listar movimentos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1) Parse + validação de shape
    const body = await req.json();
    const parsed = movimentoEstoqueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    // 2) Sanitização extra (quantidade inteira >= 1)
    const produtoId = String(parsed.data.produtoId);
    const tipo = parsed.data.tipo as "entrada" | "saida";
    const quantidade = Math.max(1, Math.floor(Number(parsed.data.quantidade)));
    const descricao =
      parsed.data.descricao ||
      (tipo === "entrada" ? "Entrada manual" : "Saída manual");

    if (!Number.isFinite(quantidade) || quantidade < 1) {
      return NextResponse.json({ error: "Quantidade inválida" }, { status: 400 });
    }

    const produtoRef = db.collection("produtos").doc(produtoId);
    const movimentoRef = db.collection("movimentosEstoque").doc();

    let novoEstoqueCalculado = 0;

    await db.runTransaction(async (tx) => {
      const produtoSnap = await tx.get(produtoRef);
      if (!produtoSnap.exists) {
        // lançar erro específico para virar 404 mais abaixo
        throw Object.assign(new Error("Produto não encontrado"), { code: "NOT_FOUND" });
      }

      const produto = produtoSnap.data() as any;
      const estoqueAtual = Number(produto?.estoque || 0);

      const novoEstoque =
        tipo === "entrada" ? estoqueAtual + quantidade : estoqueAtual - quantidade;

      if (novoEstoque < 0) {
        throw new Error("Saída excede o estoque atual");
      }

      // Atualiza produto
      tx.update(produtoRef, {
        estoque: novoEstoque,
        atualizadoEm: new Date(),
      });

      // Registra movimento
      tx.set(movimentoRef, {
        produtoId,
        tipo,
        quantidade,
        descricao,
        criadoEm: new Date(),
      });

      novoEstoqueCalculado = novoEstoque;
    });

    return NextResponse.json(
      { ok: true, movimentoId: movimentoRef.id, novoEstoque: novoEstoqueCalculado },
      { status: 201 }
    );
  } catch (e: any) {
    // Mapeia 404 quando produto não existe
    if (e?.code === "NOT_FOUND" || /Produto não encontrado/i.test(e?.message)) {
      console.error("POST /api/estoque 404:", e);
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    console.error("POST /api/estoque error:", e);
    return NextResponse.json(
      { error: e?.message || "Erro ao registrar movimento" },
      { status: 400 }
    );
  }
}
