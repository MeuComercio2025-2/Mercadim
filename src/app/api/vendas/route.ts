import { NextResponse } from "next/server";
import { vendaRepository } from "@/repository/VendaRepository";
import { vendaSchema } from "@/lib/schemas/VendaSchema";

export async function GET() {
  const vendas = await vendaRepository.find();
  return NextResponse.json(vendas);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = vendaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
  }

  const venda = await vendaRepository.create({
    ...parsed.data,
    criadoEm: new Date(),
  });

  return NextResponse.json(venda, { status: 201 });
}
