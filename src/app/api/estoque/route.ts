import { NextResponse } from "next/server";
import { estoqueService } from "@/services/EstoqueService";
import { movimentoEstoqueSchema } from "@/lib/schemas/EstoqueSchema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const produtoId = searchParams.get("produtoId") ?? undefined;
  const limit = Number(searchParams.get("limit") || 20);

  const itens = await estoqueService.listar({ produtoId, limit });
  return NextResponse.json(itens);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = movimentoEstoqueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
  }

  const result = await estoqueService.criar(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
