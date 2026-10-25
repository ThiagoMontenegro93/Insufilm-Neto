/**
 * Dupla validação de leads: Google Places + site oficial.
 * Só leads com score >= mínimo configurado podem receber disparo.
 */

export interface Lead {
  id: string;
  empresa: string;
  endereco: string;
  categoria: string;
  site?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  cnpj?: string;
  google?: { encontrado: boolean; avaliacao?: number; totalAvaliacoes?: number };
  siteOficial?: { acessado: boolean };
  optOut?: boolean;
}

export interface Pontuacao {
  total: number;
  detalhes: { rotulo: string; pontos: number }[];
  validadoGoogle: boolean;
  validadoSite: boolean;
}

export function pontuarLead(l: Lead): Pontuacao {
  const detalhes: { rotulo: string; pontos: number }[] = [];
  const g = l.google;
  if (g?.encontrado) {
    detalhes.push({ rotulo: "Encontrado no Google", pontos: 40 });
    if ((g.avaliacao ?? 0) > 4) detalhes.push({ rotulo: "Avaliação acima de 4,0", pontos: 10 });
    if ((g.totalAvaliacoes ?? 0) > 20) detalhes.push({ rotulo: "Mais de 20 avaliações", pontos: 10 });
  }
  if (l.siteOficial?.acessado) {
    detalhes.push({ rotulo: "Site oficial no ar", pontos: 20 });
    if (l.email) detalhes.push({ rotulo: "E-mail público no site", pontos: 10 });
    if (l.whatsapp) detalhes.push({ rotulo: "WhatsApp público no site", pontos: 10 });
  }
  return {
    total: Math.min(100, detalhes.reduce((s, d) => s + d.pontos, 0)),
    detalhes,
    validadoGoogle: !!g?.encontrado,
    validadoSite: !!l.siteOficial?.acessado,
  };
}

export function podeProspectar(l: Lead, scoreMinimo: number): { ok: boolean; motivo?: string } {
  if (l.optOut) return { ok: false, motivo: "Pediu para não receber contato" };
  const p = pontuarLead(l);
  if (!p.validadoGoogle || !p.validadoSite) return { ok: false, motivo: "Falta uma das duas validações" };
  if (p.total < scoreMinimo) return { ok: false, motivo: `Score abaixo de ${scoreMinimo}` };
  return { ok: true };
}

export function preencherMensagem(modelo: string, l: Lead): string {
  const avaliacao = l.google?.avaliacao ? `${l.google.avaliacao.toFixed(1).replace(".", ",")}★` : "";
  return modelo.replace(/\{empresa\}/g, l.empresa).replace(/\{avaliacao\}/g, avaliacao);
}

export function cnpjValido(cnpj: string): boolean {
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split("").reduce((s, c, i) => s + Number(c) * pesos[i], 0);
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(d.slice(0, 12));
  const d2 = calc(d.slice(0, 12) + d1);
  return d1 === Number(d[12]) && d2 === Number(d[13]);
}

export function formatarCnpj(cnpj: string): string {
  const d = cnpj.replace(/\D/g, "").padStart(14, "0");
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}
