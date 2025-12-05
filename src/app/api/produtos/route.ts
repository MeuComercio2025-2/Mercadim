import { NextResponse } from "next/server";
import admin from "@/config/firebase-admin";
import { produtoSchema } from "@/lib/schemas/ProdutoSchema";

const db = admin.firestore();
const col = db.collection("produtos");

export async function GET() {
  try {
    const snap = await col.orderBy("nome", "asc").get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/produtos error:", e);
    return NextResponse.json({ error: "Erro ao listar produtos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // nome, preco, estoque, categoriaId (opcional)
    const parsed = produtoSchema
      .pick({ nome: true, preco: true, estoque: true })
      .extend({ categoriaId: produtoSchema.shape.categoriaId })
      .safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const { nome, preco, estoque, categoriaId } = parsed.data;
    const now = new Date();

    const ref = await col.add({
      nome,
      preco,
      estoque,
      categoriaId: categoriaId ?? null,
      criadoEm: now,
      atualizadoEm: now,
      ativo: true
    });

    await ref.update({ id: ref.id });

    const doc = await ref.get();
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (e) {
    console.error("POST /api/produtos error:", e);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
