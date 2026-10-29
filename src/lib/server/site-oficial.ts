/**
 * Validação 2: lê a página inicial pública da empresa e extrai os contatos que ela mesma divulga.
 * Respeita robots.txt, usa timeout curto e não segue para outras páginas.
 */
const UA = "JRFilmes-Validador/1.0";

async function obter(url: string, ms = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(t);
  }
}

async function permitidoPorRobots(base: URL): Promise<boolean> {
  try {
    const r = await obter(new URL("/robots.txt", base).toString(), 3000);
    if (!r.ok) return true;
    const texto = await r.text();
    // Regra simples: bloqueia se houver "Disallow: /" para todos os agentes.
    const blocos = texto.split(/User-agent:/i).filter((b) => /^\s*\*/.test(b));
    return !blocos.some((b) => /^\s*Disallow:\s*\/\s*$/im.test(b));
  } catch {
    return true;
  }
}

export interface ResultadoSite {
  acessado: boolean;
  email?: string;
  whatsapp?: string;
  instagram?: string;
}

export async function validarSiteOficial(site: string): Promise<ResultadoSite> {
  let base: URL;
  try {
    base = new URL(site.startsWith("http") ? site : `https://${site}`);
  } catch {
    return { acessado: false };
  }
  if (!["http:", "https:"].includes(base.protocol)) return { acessado: false };
  // Evita SSRF: nada de endereços internos.
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[?::1\]?|.*\.internal$)/i.test(base.hostname)) return { acessado: false };
  if (!(await permitidoPorRobots(base))) return { acessado: false };
  try {
    const r = await obter(base.toString());
    if (!r.ok) return { acessado: false };
    const html = (await r.text()).slice(0, 500_000);
    const email = html.match(/mailto:([^"'?\s>]+)/i)?.[1] ?? html.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0];
    const wa = html.match(/(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\d{10,13})/i)?.[1];
    const ig = html.match(/instagram\.com\/([A-Za-z0-9_.]{2,30})/i)?.[1];
    return { acessado: true, email, whatsapp: wa?.replace(/^55/, ""), instagram: ig && !["p", "reel", "explore"].includes(ig) ? ig : undefined };
  } catch {
    return { acessado: false };
  }
}
