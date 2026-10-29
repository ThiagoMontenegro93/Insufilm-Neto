import { NextResponse } from "next/server";
import { z } from "zod";
import { cnpjValido, formatarCnpj, type Lead } from "@/lib/prospect";

const Entrada = z.object({ cnpjs: z.array(z.string()).min(1).max(30) });

interface RespostaBrasilApi {
  razao_social?: string;
  nome_fantasia?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  descricao_situacao_cadastral?: string;
}

/**
 * Enriquecimento por CNPJ com a BrasilAPI (dados públicos da Receita).
 * A dupla validação completa (Google + site) roda depois, quando houver chave do Google.
 */
export async function POST(req: Request) {
  const parse = Entrada.safeParse(await req.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ erro: "Envie de 1 a 30 CNPJs." }, { status: 400 });

  const validos = parse.data.cnpjs.map((c) => c.replace(/\D/g, "")).filter(cnpjValido);
  const invalidos = parse.data.cnpjs.length - validos.length;
  if (validos.length === 0) return NextResponse.json({ erro: "Nenhum CNPJ válido na lista." }, { status: 400 });

  const leads: Lead[] = [];
  for (const cnpj of validos) {
    try {
      const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, { headers: { Accept: "application/json" } });
      if (!r.ok) continue;
      const d = (await r.json()) as RespostaBrasilApi;
      leads.push({
        id: cnpj,
        cnpj: formatarCnpj(cnpj),
        empresa: d.nome_fantasia || d.razao_social || formatarCnpj(cnpj),
        endereco: [d.logradouro, d.numero, d.bairro, d.municipio && `${d.municipio}/${d.uf}`].filter(Boolean).join(", "),
        categoria: "outro",
        google: { encontrado: false },
        siteOficial: { acessado: false },
      });
    } catch {
      /* segue para o próximo CNPJ */
    }
  }
  const avisos = [invalidos ? `${invalidos} CNPJ(s) inválido(s) ignorado(s).` : "", "Dados da Receita carregados. Falta a validação Google + site para liberar disparo."].filter(Boolean);
  return NextResponse.json({ leads, aviso: avisos.join(" ") });
}
