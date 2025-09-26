// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { adminRedirect } from "./middlewares/adminRedirect";

const middlewares = [adminRedirect];

export async function middleware(req: NextRequest) {
  for (const fn of middlewares) {
    const res = await fn(req);
    if (res instanceof NextResponse && res.status !== 200) {
      // Se um middleware retornar redirect ou outro response, interrompe
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
