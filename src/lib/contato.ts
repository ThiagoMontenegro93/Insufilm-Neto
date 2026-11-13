import type { PlatformConfig } from "./config";

type Site = PlatformConfig["site"];

/** "5521990179141" -> "(21) 99017-9141". Números fora do padrão voltam como vieram. */
export function telefoneFormatado(numero: string): string {
  const d = numero.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return numero;
}

export function linkWhatsapp(site: Site, texto?: string): string {
  const base = `https://wa.me/${site.whatsappComercial.replace(/\D/g, "")}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

export function linkInstagram(site: Site): string {
  return `https://www.instagram.com/${site.instagram.replace(/^@/, "")}/`;
}

/** Sem o link da página cadastrado, cai na busca do Facebook pelo nome. */
export function linkFacebook(site: Site): string {
  return site.facebookUrl.trim() || `https://www.facebook.com/search/top?q=${encodeURIComponent(site.facebookNome)}`;
}

export function linkEmail(site: Site, assunto = "Orçamento"): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(assunto)}`;
}
