import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "Olá do Next.js 15 diretamente do backend 🚀"})
}