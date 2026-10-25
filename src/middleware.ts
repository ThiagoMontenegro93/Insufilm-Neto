import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * /admin e as APIs administrativas: só SUPER_ADMIN.
 * Sem NEXTAUTH_SECRET o app roda em modo demonstração e o painel fica aberto (aviso na tela).
 */
export async function middleware(req: NextRequest) {
  if (!process.env.NEXTAUTH_SECRET) return NextResponse.next();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const papel = (token as { papel?: string } | null)?.papel;
  const precisaAdmin = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/prospeccao") || (req.nextUrl.pathname.startsWith("/api/config") && req.method !== "GET");
  const precisaParceiro = req.nextUrl.pathname.startsWith("/parceiro");

  if (precisaAdmin && papel !== "SUPER_ADMIN") return negar(req);
  if (precisaParceiro && !token) return negar(req);
  return NextResponse.next();
}

function negar(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ erro: "Acesso negado." }, { status: 403 });
  const url = new URL("/entrar", req.url);
  url.searchParams.set("voltar", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/parceiro/:path*", "/api/prospeccao/:path*", "/api/config"] };
