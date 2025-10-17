import { NextResponse } from "next/server";
import { produtoRepository } from "@/repository/ProdutoRepository";
import { produtoSchema } from "@/lib/schemas/ProdutoSchema";
import { estoqueRepository } from "@/repository/EstoqueRepository";
import admin from "@/config/firebase-admin";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  const { id } = params;

  const produto = await produtoRepository.findById(id);
  if (!produto) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(produto);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = params;
  const body = await req.json();
  const parsed = produtoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.format() },
      { status: 400 }
    );
  }

  const produtoAtual = await produtoRepository.findById(id);
  if (!produtoAtual) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 }
    );
  }

  const produtoAtualizado = await produtoRepository.update({
    id,
    ...parsed.data,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  });

  const variacao =
    (parsed.data.estoque ?? produtoAtual.estoque) - produtoAtual.estoque;
  if (variacao !== 0) {
    await estoqueRepository.create({
      produtoId: id,
      tipo: variacao > 0 ? "entrada" : "saida",
      quantidade: Math.abs(variacao),
      descricao: "Atualização de estoque",
      criadoEm: new Date(),
    });
  }

  if (!produtoAtualizado) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(produtoAtualizado);
}

export async function DELETE(req: Request, { params }: { params: { id: string }}) {
  const { id } = params;
  try {
    
    await admin.firestore().collection("produtos").doc(id).delete();


    return NextResponse.json({ message: "Produto deletado com sucesso" });
  } catch (e) {
    console.error("DELETE /api/produtos/[id] error:", e);
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
  }
}
