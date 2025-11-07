import { NextResponse } from "next/server";
import { createVenda, ServiceError } from "@/services/vendaService";
import { vendaRepository } from "@/repository/VendaRepository";

export async function GET() {
  const vendas = await vendaRepository.find();
  return NextResponse.json(vendas);
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const venda = await createVenda(body);
    return NextResponse.json(venda, { status: 201 });
  } catch (err: any) {
    if (err instanceof ServiceError) {
      // inclui payload se tiver erros de validacao
      if (err.payload) {
        return NextResponse.json({ errors: err.payload }, { status: err.status });
      }
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Unexpected error creating venda:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
