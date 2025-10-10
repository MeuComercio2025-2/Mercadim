import { NextResponse } from "next/server";
import { produtoRepository } from "@/repository/ProdutoRepository";
import { produtoSchema } from "@/lib/schemas/ProdutoSchema";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = produtoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
  }

  const produto = await produtoRepository.create({
    ...parsed.data, // já inclui categoriaId do body
    criadoEm: new Date(),
  });

  return NextResponse.json(produto, { status: 201 });
}
