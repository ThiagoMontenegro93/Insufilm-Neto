/**
 * Rastreio de indicações: telefone normalizado + código do parceiro.
 * Formato do código: IND-AAAAMMDD-CODIGO-NNN (ex.: IND-20240512-JORG-001).
 */

export type StatusIndicacao = "PENDENTE" | "EM_CONTATO" | "ORCAMENTO_GERADO" | "FECHADO" | "PAGO_COMISSAO";

export const ETAPAS_INDICACAO: { status: StatusIndicacao; rotulo: string; progresso: number }[] = [
  { status: "PENDENTE", rotulo: "Pendente", progresso: 20 },
  { status: "EM_CONTATO", rotulo: "Em contato", progresso: 40 },
  { status: "ORCAMENTO_GERADO", rotulo: "Orçamento gerado", progresso: 60 },
  { status: "FECHADO", rotulo: "Fechado", progresso: 80 },
  { status: "PAGO_COMISSAO", rotulo: "Comissão paga", progresso: 100 },
];

export const progressoDe = (s: StatusIndicacao) => ETAPAS_INDICACAO.find((e) => e.status === s)!.progresso;

/**
 * Remove máscara e DDI 55. Retorna DDD + número (10 ou 11 dígitos) ou null se inválido.
 */
export function normalizarTelefone(entrada: string): string | null {
  let d = entrada.replace(/\D/g, "");
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10 && d.length !== 11) return null;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return null;
  if (d.length === 11 && d[2] !== "9") return null;
  return d;
}

export function mascararTelefone(normalizado: string): string {
  const ddd = normalizado.slice(0, 2);
  const resto = normalizado.slice(2);
  const corte = resto.length === 9 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

export function validarCodigoParceiro(codigo: string): boolean {
  return /^[A-Z0-9]{3,8}$/.test(codigo);
}

export function gerarCodigoIndicacao(codigoParceiro: string, data: Date, sequencial: number): string {
  if (!validarCodigoParceiro(codigoParceiro)) throw new Error("Código de parceiro inválido");
  const aaaammdd = `${data.getFullYear()}${String(data.getMonth() + 1).padStart(2, "0")}${String(data.getDate()).padStart(2, "0")}`;
  return `IND-${aaaammdd}-${codigoParceiro}-${String(sequencial).padStart(3, "0")}`;
}

export function lerCodigoIndicacao(codigo: string) {
  const m = /^IND-(\d{8})-([A-Z0-9]{3,8})-(\d{3})$/.exec(codigo.trim().toUpperCase());
  if (!m) return null;
  return { data: m[1], parceiro: m[2], sequencial: Number(m[3]) };
}
