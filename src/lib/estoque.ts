/**
 * Estoque por bobina.
 *
 * Toda película e vinil vem em bobina de largura fixa (normalmente 1,52 m). Por isso o controle é feito
 * em METRO LINEAR restante de cada bobina, e o m² é sempre largura × comprimento. A baixa de um serviço
 * registra quanto foi cortado da bobina (metro linear) e quanto foi aplicado de fato (m²); a diferença é
 * perda, ou vira retalho aproveitável se o pedaço for grande o bastante.
 */

export type CategoriaMaterial = "antivandalismo" | "insulfilm" | "jateado" | "envelopamento" | "decorativo" | "ppf";

export const CATEGORIAS: { id: CategoriaMaterial; nome: string; perdaPadraoPct: number }[] = [
  { id: "antivandalismo", nome: "Antivandalismo / segurança", perdaPadraoPct: 12 },
  { id: "insulfilm", nome: "Insulfilm (controle solar)", perdaPadraoPct: 15 },
  { id: "jateado", nome: "Jateado / privacidade", perdaPadraoPct: 12 },
  { id: "envelopamento", nome: "Envelopamento automotivo", perdaPadraoPct: 15 },
  { id: "decorativo", nome: "Vinil decorativo / arquitetônico", perdaPadraoPct: 12 },
  { id: "ppf", nome: "PPF (proteção de pintura)", perdaPadraoPct: 15 },
];

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj?: string;
  marcas: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  site?: string;
  prazoEntregaDias: number;
  observacoes?: string;
}

export interface Material {
  id: string;
  nome: string;
  categoria: CategoriaMaterial;
  fornecedorId: string;
  /** Largura padrão da bobina deste material, em metros. */
  larguraM: number;
  /** Abaixo deste saldo (m²) o painel alerta para repor. */
  estoqueMinimoM2: number;
  /** Pedaço mínimo (metro linear) que ainda vale guardar como retalho. */
  retalhoMinimoM: number;
}

export type StatusBobina = "LACRADA" | "ABERTA" | "FINALIZADA";

export interface Bobina {
  id: string;
  codigo: string;
  materialId: string;
  fornecedorId: string;
  larguraM: number;
  comprimentoInicialM: number;
  comprimentoRestanteM: number;
  /** Valor pago pela bobina inteira, em reais (com frete). */
  custoTotal: number;
  notaFiscal?: string;
  dataEntrada: string;
  status: StatusBobina;
  /** Retalho gerado a partir de outra bobina. */
  origemBobinaId?: string;
}

export type TipoMovimento = "ENTRADA" | "CONSUMO" | "RETALHO" | "AJUSTE";

export interface Movimento {
  id: string;
  bobinaId: string;
  materialId: string;
  tipo: TipoMovimento;
  data: string;
  /** Metro linear tirado (negativo) ou colocado (positivo) na bobina. */
  comprimentoM: number;
  m2Cortado: number;
  m2Aplicado: number;
  m2Perda: number;
  custo: number;
  /** Ordem de serviço / orçamento, cliente ou motivo do ajuste. */
  referencia?: string;
  observacao?: string;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const r3 = (n: number) => Math.round(n * 1000) / 1000;

export const m2 = (larguraM: number, comprimentoM: number) => r3(larguraM * comprimentoM);

export function custoM2Bobina(b: Pick<Bobina, "custoTotal" | "larguraM" | "comprimentoInicialM">) {
  const area = b.larguraM * b.comprimentoInicialM;
  return area > 0 ? r2(b.custoTotal / area) : 0;
}

export const m2Restante = (b: Bobina) => m2(b.larguraM, b.comprimentoRestanteM);
export const pctRestante = (b: Bobina) => (b.comprimentoInicialM > 0 ? Math.round((b.comprimentoRestanteM / b.comprimentoInicialM) * 100) : 0);

/** Código legível da bobina: BOB-AAAAMMDD-NNN. */
export function gerarCodigoBobina(data: Date, sequencia: number) {
  const d = `${data.getFullYear()}${String(data.getMonth() + 1).padStart(2, "0")}${String(data.getDate()).padStart(2, "0")}`;
  return `BOB-${d}-${String(sequencia).padStart(3, "0")}`;
}

/** Quanto cortar da bobina (metro linear) para cobrir uma área, já com a margem de perda. */
export function sugerirCorte(areaM2: number, larguraM: number, perdaPct: number) {
  if (areaM2 <= 0 || larguraM <= 0) return 0;
  return Math.ceil(((areaM2 * (1 + perdaPct / 100)) / larguraM) * 10) / 10;
}

export interface EntradaBaixa {
  areaAplicadaM2: number;
  comprimentoCortadoM: number;
  /** Parte do corte que sobrou inteira e volta ao estoque como retalho (metro linear, mesma largura). */
  retalhoM?: number;
  referencia?: string;
  data: string;
  idMovimento: string;
  idRetalho?: string;
  codigoRetalho?: string;
}

export interface ResultadoBaixa {
  bobina: Bobina;
  movimento: Movimento;
  retalho?: Bobina;
  movimentoRetalho?: Movimento;
  perdaPct: number;
}

/** Valida e calcula a baixa de um serviço numa bobina. Lança erro com mensagem para o usuário. */
export function registrarBaixa(b: Bobina, e: EntradaBaixa): ResultadoBaixa {
  const corte = r3(e.comprimentoCortadoM);
  const retalho = r3(e.retalhoM ?? 0);
  if (b.status === "FINALIZADA") throw new Error("Esta bobina já acabou. Escolha outra.");
  if (corte <= 0) throw new Error("Informe quantos metros foram cortados da bobina.");
  if (corte > b.comprimentoRestanteM + 1e-9) throw new Error(`A bobina só tem ${b.comprimentoRestanteM.toFixed(2)} m restantes.`);
  if (retalho < 0 || retalho >= corte) throw new Error("O retalho precisa ser menor que o corte.");
  const m2Cortado = m2(b.larguraM, corte);
  const m2Retalho = m2(b.larguraM, retalho);
  const aplicado = r3(e.areaAplicadaM2);
  if (aplicado <= 0) throw new Error("Informe a área aplicada no serviço.");
  if (aplicado > m2Cortado - m2Retalho + 1e-9) throw new Error("A área aplicada não pode passar do que foi cortado (menos o retalho).");

  const custoM2 = custoM2Bobina(b);
  const m2Perda = r3(m2Cortado - m2Retalho - aplicado);
  const consumidoM2 = m2Cortado - m2Retalho;
  const restante = r3(b.comprimentoRestanteM - corte);

  const bobina: Bobina = { ...b, comprimentoRestanteM: restante, status: restante <= 0 ? "FINALIZADA" : "ABERTA" };
  const movimento: Movimento = {
    id: e.idMovimento,
    bobinaId: b.id,
    materialId: b.materialId,
    tipo: "CONSUMO",
    data: e.data,
    comprimentoM: -corte,
    m2Cortado,
    m2Aplicado: aplicado,
    m2Perda,
    custo: r2(consumidoM2 * custoM2),
    referencia: e.referencia,
  };

  let retalhoBobina: Bobina | undefined;
  let movimentoRetalho: Movimento | undefined;
  if (retalho > 0) {
    retalhoBobina = {
      id: e.idRetalho ?? `${b.id}-r`,
      codigo: e.codigoRetalho ?? `${b.codigo}-R`,
      materialId: b.materialId,
      fornecedorId: b.fornecedorId,
      larguraM: b.larguraM,
      comprimentoInicialM: retalho,
      comprimentoRestanteM: retalho,
      custoTotal: r2(m2Retalho * custoM2),
      dataEntrada: e.data,
      status: "ABERTA",
      origemBobinaId: b.id,
    };
    movimentoRetalho = {
      id: `${e.idMovimento}-r`,
      bobinaId: retalhoBobina.id,
      materialId: b.materialId,
      tipo: "RETALHO",
      data: e.data,
      comprimentoM: retalho,
      m2Cortado: 0,
      m2Aplicado: 0,
      m2Perda: 0,
      custo: retalhoBobina.custoTotal,
      referencia: e.referencia,
      observacao: `Sobra do corte da ${b.codigo}`,
    };
  }

  return { bobina, movimento, retalho: retalhoBobina, movimentoRetalho, perdaPct: m2Cortado > 0 ? Math.round((m2Perda / m2Cortado) * 100) : 0 };
}

export interface SaldoMaterial {
  materialId: string;
  m2: number;
  valor: number;
  custoMedioM2: number;
  bobinas: number;
}

/** Saldo em m² e em reais por material, com custo médio ponderado pelo que resta em cada bobina. */
export function saldoPorMaterial(bobinas: Bobina[]): Record<string, SaldoMaterial> {
  const out: Record<string, SaldoMaterial> = {};
  for (const b of bobinas) {
    if (b.status === "FINALIZADA") continue;
    const s = (out[b.materialId] ??= { materialId: b.materialId, m2: 0, valor: 0, custoMedioM2: 0, bobinas: 0 });
    const area = m2Restante(b);
    s.m2 = r3(s.m2 + area);
    s.valor = r2(s.valor + area * custoM2Bobina(b));
    s.bobinas += 1;
  }
  for (const s of Object.values(out)) s.custoMedioM2 = s.m2 > 0 ? r2(s.valor / s.m2) : 0;
  return out;
}

export interface Alerta {
  tipo: "ESTOQUE_MINIMO" | "BOBINA_ACABANDO" | "PERDA_ALTA";
  materialId: string;
  bobinaId?: string;
  mensagem: string;
}

export function alertas(materiais: Material[], bobinas: Bobina[], movimentos: Movimento[]): Alerta[] {
  const saldo = saldoPorMaterial(bobinas);
  const lista: Alerta[] = [];
  for (const m of materiais) {
    const s = saldo[m.id]?.m2 ?? 0;
    if (s < m.estoqueMinimoM2) lista.push({ tipo: "ESTOQUE_MINIMO", materialId: m.id, mensagem: `${m.nome}: ${s.toFixed(1)} m² em estoque, mínimo ${m.estoqueMinimoM2} m².` });
  }
  for (const b of bobinas) {
    if (b.status === "FINALIZADA" || b.origemBobinaId) continue;
    if (pctRestante(b) <= 10) {
      const m = materiais.find((x) => x.id === b.materialId);
      lista.push({ tipo: "BOBINA_ACABANDO", materialId: b.materialId, bobinaId: b.id, mensagem: `${b.codigo} (${m?.nome ?? "material"}): restam ${b.comprimentoRestanteM.toFixed(2)} m.` });
    }
  }
  const categoriaDe = (id: string) => materiais.find((m) => m.id === id)?.categoria;
  for (const m of materiais) {
    const consumos = movimentos.filter((x) => x.tipo === "CONSUMO" && x.materialId === m.id);
    const cortado = consumos.reduce((a, x) => a + x.m2Cortado, 0);
    const perda = consumos.reduce((a, x) => a + x.m2Perda, 0);
    const limite = (CATEGORIAS.find((c) => c.id === categoriaDe(m.id))?.perdaPadraoPct ?? 15) + 5;
    if (cortado >= 5 && (perda / cortado) * 100 > limite) {
      lista.push({ tipo: "PERDA_ALTA", materialId: m.id, mensagem: `${m.nome}: perda de ${Math.round((perda / cortado) * 100)}% nos cortes, acima de ${limite}%.` });
    }
  }
  return lista;
}

export interface PremissasPreco {
  perdaPct: number;
  maoDeObraM2: number;
  impostosPct: number;
  comissaoPct: number;
  margemPct: number;
  taxaCartaoPct: number;
}

/**
 * Preço por m² a partir do custo real do material:
 * custo direto = material × (1 + perda) + mão de obra; preço = custo direto ÷ (1 − impostos − comissão − margem [− cartão]).
 */
export function precoSugeridoM2(custoMaterialM2: number, p: PremissasPreco) {
  const direto = custoMaterialM2 * (1 + p.perdaPct / 100) + p.maoDeObraM2;
  const base = 1 - (p.impostosPct + p.comissaoPct + p.margemPct) / 100;
  const baseCartao = base - p.taxaCartaoPct / 100;
  return {
    custoDireto: r2(direto),
    pix: base > 0 ? r2(direto / base) : 0,
    cartao: baseCartao > 0 ? r2(direto / baseCartao) : 0,
  };
}
