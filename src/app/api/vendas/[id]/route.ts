import { NextResponse } from "next/server";
import { vendaRepository } from "@/repository/VendaRepository";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const venda = await vendaRepository.findById(params.id);
  if (!venda) return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 });
  return NextResponse.json(venda);
}

export async function DELETE(_: Request, { params }: Params) {
  await vendaRepository.delete(params.id);
  return NextResponse.json({ success: true });
}
