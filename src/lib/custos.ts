/**
 * Preço de venda a partir do custo do material.
 *
 * custo direto = material/m² × (1 + perda) × m² por unidade + mão de obra
 * preço PIX    = custo direto ÷ (1 − impostos − comissões − margem)
 * preço cartão = custo direto ÷ (1 − impostos − comissões − margem − taxa do cartão)
 *
 * As comissões são as da plataforma (e do indicador, se a premissa pedir), lidas de `taxas`.
 * O resultado é arredondado para cima no múltiplo escolhido, para o preço nunca ficar abaixo do custo.
 */
import type { CustoItem, PlatformConfig, Precificacao } from "./config";

export interface PrecoPeloCusto {
  /** Material com perda + mão de obra, por m² ou por unidade. */
  custoDireto: number;
  /** Só o material com perda, para mostrar o peso dele no preço. */
  material: number;
  pix: number;
  cartao: number;
  /** Quanto do preço PIX sobra como margem. */
  margem: number;
  /** Percentual descontado do preço antes da margem (impostos + comissões). */
  deducoesPct: number;
  /** false quando as deduções passam de 100% e não há preço possível. */
  viavel: boolean;
}

const centavos = (v: number) => Math.round(v * 100);
const arredondarCima = (valor: number, multiplo: number) => {
  const m = multiplo > 0 ? multiplo : 1;
  // tira o ruído de ponto flutuante antes do ceil (ex.: 117.0000001)
  return Math.ceil(Math.round(valor * 100) / 100 / m) * m;
};

export function comissaoNoPreco(taxas: PlatformConfig["taxas"], p: Precificacao) {
  return taxas.plataformaPct + (p.incluirIndicador ? taxas.indicadorPct : 0);
}

/**
 * Calcula o preço de um item. `porUnidade` vale para itens de valor fechado e carros:
 * o material é multiplicado pelos m² gastos em uma unidade.
 */
export function precoPeloCusto(custo: CustoItem, porUnidade: boolean, taxas: PlatformConfig["taxas"], p: Precificacao): PrecoPeloCusto {
  const area = porUnidade ? Math.max(0, custo.m2PorUnidade ?? 0) : 1;
  const material = centavos(Math.max(0, custo.materialM2) * (1 + Math.max(0, custo.perdaPct) / 100) * area) / 100;
  const custoDireto = centavos(material + Math.max(0, custo.maoDeObra)) / 100;
  const deducoesPct = p.impostosPct + comissaoNoPreco(taxas, p);
  const base = 1 - (deducoesPct + p.margemPct) / 100;
  const baseCartao = base - p.taxaCartaoPct / 100;
  const viavel = base > 0 && baseCartao > 0;
  const pix = viavel ? arredondarCima(custoDireto / base, p.arredondarPara) : 0;
  const cartao = viavel ? arredondarCima(custoDireto / baseCartao, p.arredondarPara) : 0;
  return {
    custoDireto,
    material,
    pix,
    cartao,
    margem: centavos((pix * p.margemPct) / 100) / 100,
    deducoesPct,
    viavel,
  };
}

/**
 * Atualiza os preços dos itens com custo automático. Itens manuais ficam como estão.
 * Roda toda vez que a configuração é salva, então mudar margem, impostos ou comissão
 * reprecifica todas as calculadoras de uma vez.
 */
export function recalcularPrecos(config: PlatformConfig): PlatformConfig {
  const { taxas, precificacao: p } = config;
  if (!p) return config;
  const itens = [...config.servicos.peliculaSeguranca, ...config.servicos.envelopamento.marcas, ...config.servicos.arquitetonico];
  for (const item of itens) {
    if (!item.custo?.automatico) continue;
    const r = precoPeloCusto(item.custo, item.unidade === "fixo", taxas, p);
    if (r.viavel) item.preco = r.pix;
  }
  for (const linha of config.servicos.antivandalismo) {
    if (!linha.custo?.automatico) continue;
    const r = precoPeloCusto(linha.custo, linha.unidade === "veiculo", taxas, p);
    if (!r.viavel) continue;
    linha.precoVista = r.pix;
    linha.precoCartao = r.cartao;
  }
  return config;
}

/** R$ por m² de uma bobina: o que foi pago ÷ (largura × comprimento). */
export function custoM2DaBobina(precoPago: number, larguraM: number, comprimentoM: number) {
  const area = larguraM * comprimentoM;
  return area > 0 ? centavos(precoPago / area) / 100 : 0;
}
