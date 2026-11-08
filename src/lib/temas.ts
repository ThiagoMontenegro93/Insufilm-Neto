/**
 * Temas da vitrine Aplik Films. As cores ficam em src/app/globals.css ([data-tema="..."]);
 * aqui ficam o nome, a descrição e as amostras usadas no seletor e no Creator Hub.
 */
export const TEMAS = [
  { id: "noir", nome: "Aplik Noir", descricao: "Preto com vermelho e brilho, como nas artes", modo: "escuro", amostra: ["#0a0a0b", "#141417", "#ee2028"] },
  { id: "claro", nome: "Claro", descricao: "Branco gelo, letras pretas e vermelho da marca", modo: "claro", amostra: ["#f6f7f9", "#ffffff", "#d60812"] },
  { id: "metalizado", nome: "Metalizado", descricao: "Aço escovado prateado com cartões cromados", modo: "claro", amostra: ["#b9bdc3", "#e9eaed", "#c80610"] },
  { id: "carbono", nome: "Carbono", descricao: "Fibra de carbono com neon vermelho", modo: "escuro", amostra: ["#0c0c0d", "#2a2a2e", "#ff2434"] },
  { id: "vidro", nome: "Vidro", descricao: "Gradiente vinho com cartões de vidro fosco", modo: "escuro", amostra: ["#09060a", "#5a1424", "#ff4050"] },
  { id: "perola", nome: "Pérola", descricao: "Off-white quente, editorial e minimalista", modo: "claro", amostra: ["#f5f1ea", "#fbf9f5", "#be0e1a"] },
] as const;

export type TemaId = (typeof TEMAS)[number]["id"];

export const CHAVE_TEMA = "aplik.tema";

export function temaValido(v: unknown): v is TemaId {
  return typeof v === "string" && TEMAS.some((t) => t.id === v);
}

/**
 * Script que roda antes da pintura para não piscar o tema errado.
 * Ordem: ?tema= na URL (para mandar o link de um tema), escolha do visitante, padrão do Creator Hub, Noir.
 */
export const SCRIPT_TEMA = `(function(){try{var ids=${JSON.stringify(TEMAS.map((t) => t.id))};var q=new URLSearchParams(location.search).get('tema');if(q&&ids.indexOf(q)>-1){localStorage.setItem('${CHAVE_TEMA}',q);}var t=localStorage.getItem('${CHAVE_TEMA}');if(!t||ids.indexOf(t)<0){var c=JSON.parse(localStorage.getItem('fph.config.v1')||'null');t=c&&c.site&&c.site.tema;}if(!t||ids.indexOf(t)<0)t='noir';document.documentElement.setAttribute('data-tema',t);}catch(e){document.documentElement.setAttribute('data-tema','noir');}})();`;
