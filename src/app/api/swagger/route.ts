import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  const yaml = await readFile(join(process.cwd(), "swagger.yaml"), "utf-8");
  return new NextResponse(yaml, {
    headers: { "Content-Type": "application/yaml; charset=utf-8", "Cache-Control": "no-store" },
  });
}
