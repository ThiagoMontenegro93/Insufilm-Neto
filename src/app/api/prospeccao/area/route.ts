import { NextResponse } from "next/server";
import { z } from "zod";
import { LEADS_EXEMPLO } from "@/lib/leads-exemplo";
import type { Lead } from "@/lib/prospect";
import { validarSiteOficial } from "@/lib/server/site-oficial";
import { CONFIG_PADRAO } from "@/lib/config";

const Entrada = z.object({ area: z.string().trim().min(3).max(120), categoria: z.string().trim().min(2).max(40) });

/**
 * Validação 1 pela Google Places API (Text Search). Sem chave, devolve dados de exemplo.
 */
export async function POST(req: Request) {
  const parse = Entrada.safeParse(await req.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ erro: "Informe área e categoria." }, { status: 400 });
  const { area, categoria } = parse.data;
  const chave = process.env.GOOGLE_PLACES_API_KEY;
  if (!chave) {
    return NextResponse.json({ leads: LEADS_EXEMPLO, aviso: "Modo demonstração: configure GOOGLE_PLACES_API_KEY para buscar de verdade." });
  }

  const nomeCategoria = CONFIG_PADRAO.nichos.find((n) => n.id === categoria)?.nome ?? categoria;
  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": chave,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber",
    },
    body: JSON.stringify({ textQuery: `${nomeCategoria} em ${area}`, languageCode: "pt-BR", regionCode: "BR", pageSize: 15 }),
  });
  if (!r.ok) return NextResponse.json({ erro: `Google Places respondeu ${r.status}.` }, { status: 502 });
  const dados = (await r.json()) as { places?: { id: string; displayName?: { text: string }; formattedAddress?: string; rating?: number; userRatingCount?: number; websiteUri?: string }[] };

  const leads: Lead[] = await Promise.all(
    (dados.places ?? []).map(async (p) => {
      const site = p.websiteUri ? await validarSiteOficial(p.websiteUri) : { acessado: false };
      return {
        id: p.id,
        empresa: p.displayName?.text ?? "Sem nome",
        endereco: p.formattedAddress ?? "",
        categoria,
        site: p.websiteUri?.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        email: site.email,
        whatsapp: site.whatsapp,
        instagram: site.instagram,
        google: { encontrado: true, avaliacao: p.rating, totalAvaliacoes: p.userRatingCount },
        siteOficial: { acessado: site.acessado },
      } satisfies Lead;
    }),
  );
  return NextResponse.json({ leads });
}
