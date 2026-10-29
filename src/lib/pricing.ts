/**
 * Motor de preços e split. Todo cálculo é feito em centavos inteiros
 * para não acumular erro de ponto flutuante.
 */
import type { PlatformConfig } from "./config";

export const paraCentavos = (reais: number) => Math.round(reais * 100);
export const paraReais = (centavos: number) => centavos / 100;

const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const brl = (reais: number) => formatador.format(reais);

export const m2 = (largura: number, altura: number) =>
  Math.round(Math.max(0, largura) * Math.max(0, altura) * 100) / 100;

export interface Split {
  bruto: number;
  desconto: number;
  liquido: number;
  plataforma: number;
  indicador: number;
  locatario: number;
}

/**
 * Divide o valor do serviço: plataforma (dono) + indicador + locatário (filial).
 * O locatário fica com o resto, então a soma sempre fecha com o líquido.
 */
export function calcularSplit(
  valorReais: number,
  taxas: PlatformConfig["taxas"],
  opts: { comIndicacao?: boolean; descontoPct?: number } = {},
): Split {
  const { comIndicacao = true, descontoPct = 0 } = opts;
  const bruto = paraCentavos(valorReais);
  const desconto = Math.round((bruto * descontoPct) / 100);
  const liquido = bruto - desconto;
  const plataforma = Math.round((liquido * taxas.plataformaPct) / 100);
  const indicador = comIndicacao ? Math.round((liquido * taxas.indicadorPct) / 100) : 0;
  const locatario = liquido - plataforma - indicador;
  return {
    bruto: paraReais(bruto),
    desconto: paraReais(desconto),
    liquido: paraReais(liquido),
    plataforma: paraReais(plataforma),
    indicador: paraReais(indicador),
    locatario: paraReais(locatario),
  };
}

/** Envelopamento automotivo: m² × (valor base da marca + adicional do acabamento). */
export function precoEnvelopamento(
  config: PlatformConfig,
  marcaId: string,
  acabamentoId: string,
  areaM2: number,
) {
  const marca = config.servicos.envelopamento.marcas.find((m) => m.id === marcaId);
  const acabamento = config.servicos.envelopamento.acabamentos.find((a) => a.id === acabamentoId);
  if (!marca || !acabamento) throw new Error("Marca ou acabamento não encontrado");
  const valorM2 = marca.preco + acabamento.adicionalM2;
  const total = paraReais(Math.round(areaM2 * paraCentavos(valorM2)));
  return { marca, acabamento, valorM2, areaM2, total };
}

export interface LinhaOrcamento {
  itemId: string;
  largura?: number;
  altura?: number;
  quantidade: number;
}

/** Soma linhas de um orçamento por m² ou valor fixo, usando os preços do Creator Hub. */
export function precoLinhas<T extends { id: string; unidade: "m2" | "fixo"; preco: number }>(itens: T[], linhas: LinhaOrcamento[]) {
  let totalCentavos = 0;
  let areaTotal = 0;
  const detalhadas = linhas.map((l) => {
    const item = itens.find((i) => i.id === l.itemId);
    if (!item) throw new Error(`Item ${l.itemId} não encontrado`);
    const qtd = Math.max(0, Math.floor(l.quantidade));
    if (item.unidade === "fixo") {
      const sub = paraCentavos(item.preco) * qtd;
      totalCentavos += sub;
      return { ...l, item, area: 0, subtotal: paraReais(sub) };
    }
    const area = m2(l.largura ?? 0, l.altura ?? 0) * qtd;
    const sub = Math.round(area * paraCentavos(item.preco));
    totalCentavos += sub;
    areaTotal += area;
    return { ...l, item, area: Math.round(area * 100) / 100, subtotal: paraReais(sub) };
  });
  return { linhas: detalhadas, areaTotal: Math.round(areaTotal * 100) / 100, total: paraReais(totalCentavos) };
}
