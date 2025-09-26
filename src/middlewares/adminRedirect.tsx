// middlewares/adminRedirect.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function adminRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin`, { cache: "no-store" });
    const { hasAdmin } = await res.json();

    if (!hasAdmin && url.pathname === "/login") {
      url.pathname = "/register";
      return NextResponse.redirect(url);
    }

    if (hasAdmin && url.pathname === "/register") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("Erro no middleware adminRedirect:", err);
  }

  return NextResponse.next();
}
