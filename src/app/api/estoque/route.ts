import { NextResponse } from "next/server";
import admin from "@/config/firebase-admin";
import { movimentoEstoqueSchema } from "@/lib/schemas/EstoqueSchema";

const db = admin.firestore();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const produtoId = searchParams.get("produtoId");
  const limitParam = Number(searchParams.get("limit") || 20);

  try {
    let query: FirebaseFirestore.Query = db
      .collection("movimentosEstoque")
      .orderBy("criadoEm", "desc");

    if (produtoId) {
      // Para equality + orderBy o Firestore pode exigir índice composto.
      query = query.where("produtoId", "==", produtoId).orderBy("criadoEm", "desc");
    }

    const snap = await query.limit(limitParam).get();
    const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(items);
  } catch (e: any) {
    // Mensagem de índice composto não criado
    if (String(e?.code) === "failed-precondition" && /index/i.test(String(e?.message))) {
      console.warn("Firestore index required:", e?.message);
      return NextResponse.json(
        { error: "Índice necessário no Firestore. Crie o índice sugerido no erro do console." },
        { status: 500 }
      );
    }

    console.error("GET /api/estoque error:", e);
    return NextResponse.json({ error: "Erro ao listar movimentos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = movimentoEstoqueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const { produtoId, tipo, quantidade, descricao } = parsed.data;
    const produtoRef = db.collection("produtos").doc(produtoId);
    const movimentoRef = db.collection("movimentosEstoque").doc();

    let novoEstoqueCalculado = 0;

    await db.runTransaction(async (tx) => {
      const produtoSnap = await tx.get(produtoRef);
      if (!produtoSnap.exists) {
        throw Object.assign(new Error("Produto não encontrado"), { code: "NOT_FOUND" });
      }

      const produto = produtoSnap.data() as any;
      const estoqueAtual = Number(produto?.estoque || 0);
      const novoEstoque =
        tipo === "entrada" ? estoqueAtual + quantidade : estoqueAtual - quantidade;

      if (novoEstoque < 0) {
        throw new Error("Saída excede o estoque atual");
      }

      tx.update(produtoRef, { estoque: novoEstoque, atualizadoEm: new Date() });
      tx.set(movimentoRef, {
        produtoId,
        tipo,
        quantidade,
        descricao: descricao || (tipo === "entrada" ? "Entrada manual" : "Saída manual"),
        criadoEm: new Date(),
      });

      novoEstoqueCalculado = novoEstoque;
    });

    return NextResponse.json(
      { ok: true, movimentoId: movimentoRef.id, novoEstoque: novoEstoqueCalculado },
      { status: 201 }
    );
  } catch (e: any) {
    if (e?.code === "NOT_FOUND" || /Produto não encontrado/i.test(e?.message)) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: e?.message || "Erro ao registrar movimento" }, { status: 400 });
  }
}
