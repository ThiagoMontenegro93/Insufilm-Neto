export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CONFIG_PADRAO, type PlatformConfig } from "@/lib/config";
import { authOptions } from "@/lib/server/auth";
import { db, temBanco } from "@/lib/server/db";

/** GET: configuração pública (preços e taxas) — sem os dados de integração. */
export async function GET() {
  const dados = temBanco() ? ((await db.configPlataforma.findUnique({ where: { id: 1 } }))?.dados as PlatformConfig | undefined) : undefined;
  const publico: Partial<PlatformConfig> = { ...(dados ?? CONFIG_PADRAO) };
  delete publico.apis;
  return NextResponse.json(publico);
}

/** PUT: salva a configuração e grava CONFIG_PLATAFORMA_ALTERADA com snapshot antes/depois. */
export async function PUT(req: Request) {
  if (!temBanco()) return NextResponse.json({ erro: "Configure DATABASE_URL para salvar no servidor." }, { status: 503 });
  const sessao = await getServerSession(authOptions);
  const usuario = sessao?.user as { id?: string; papel?: string } | undefined;
  if (usuario?.papel !== "SUPER_ADMIN" || !usuario.id) return NextResponse.json({ erro: "Acesso negado." }, { status: 403 });

  const { config, descricao } = (await req.json()) as { config: PlatformConfig; descricao: string };
  const t = config?.taxas;
  if (!t || t.plataformaPct < 0 || t.indicadorPct < 0 || t.plataformaPct + t.indicadorPct > 100) {
    return NextResponse.json({ erro: "Taxas inválidas: a soma não pode passar de 100%." }, { status: 400 });
  }

  const atual = (await db.configPlataforma.findUnique({ where: { id: 1 } }))?.dados ?? CONFIG_PADRAO;
  await db.$transaction([
    db.configPlataforma.upsert({ where: { id: 1 }, create: { id: 1, dados: config as object }, update: { dados: config as object, versao: { increment: 1 } } }),
    db.logAuditoria.create({
      data: {
        acao: "CONFIG_PLATAFORMA_ALTERADA",
        descricao: String(descricao ?? "Configuração alterada").slice(0, 200),
        usuarioId: usuario.id,
        antes: atual as object,
        depois: config as object,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
      },
    }),
  ]);
  return NextResponse.json({ ok: true });
}
