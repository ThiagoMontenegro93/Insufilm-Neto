import type { Lead } from "./prospect";

/** Dados de exemplo para o modo demonstração (sem chaves de API configuradas). */
export const LEADS_EXEMPLO: Lead[] = [
  {
    id: "ex-1",
    empresa: "Mecânica do Paulo",
    endereco: "Rua Conde de Bonfim, 100 · Tijuca, Rio de Janeiro",
    categoria: "oficina",
    site: "mecanicadopaulo.com.br",
    email: "contato@mecanicadopaulo.com.br",
    whatsapp: "21999998888",
    instagram: "mecanicadopaulo",
    google: { encontrado: true, avaliacao: 4.7, totalAvaliacoes: 89 },
    siteOficial: { acessado: true },
  },
  {
    id: "ex-2",
    empresa: "Auto Peças Tijuca",
    endereco: "Rua Haddock Lobo, 200 · Tijuca, Rio de Janeiro",
    categoria: "autopecas",
    site: "autopecastijuca.com.br",
    email: "vendas@autopecastijuca.com.br",
    google: { encontrado: true, avaliacao: 4.3, totalAvaliacoes: 45 },
    siteOficial: { acessado: true },
  },
  {
    id: "ex-3",
    empresa: "Condomínio Solar da Tijuca",
    endereco: "Rua Uruguai, 380 · Tijuca, Rio de Janeiro",
    categoria: "condominio",
    google: { encontrado: true, avaliacao: 3.9, totalAvaliacoes: 12 },
    siteOficial: { acessado: false },
  },
  {
    id: "ex-4",
    empresa: "Vidraçaria Saens Peña",
    endereco: "Praça Saens Peña, 45 · Tijuca, Rio de Janeiro",
    categoria: "vidracaria",
    site: "vidracariasaenspena.com.br",
    whatsapp: "21988887777",
    instagram: "vidracariasaenspena",
    google: { encontrado: true, avaliacao: 4.6, totalAvaliacoes: 31 },
    siteOficial: { acessado: true },
    optOut: true,
  },
];
