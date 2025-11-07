// File: src/app/api/feedback/route.ts
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    if (!payload) {
      return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
    }

    const { email, descricao, assunto } = payload;
    if (!email || !descricao) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: email e descrição." },
        { status: 400 }
      );
    }

    // Lazy imports para evitar erros de inicialização do FireORM/Firebase
    const admin = (await import("@/config/firebase-admin")).default;
    const firestore = admin.firestore();

    // Criação direta no Firestore
    const ref = await firestore.collection("feedbacks").add({
      email,
      descricao,
      assunto: assunto || null,
      criadoEm: new Date(),
    });

    await ref.update({ id: ref.id });
    const doc = await ref.get();

    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
  } catch (err: any) {
    console.error("Erro ao criar feedback:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: err?.message },
      { status: 500 }
    );
  }
}
