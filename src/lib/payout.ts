/**
 * Regras de saque PIX do parceiro.
 */
import type { PlatformConfig } from "./config";
import { normalizarTelefone } from "./referral";

export type StatusSaque = "PENDENTE" | "APROVADO" | "PAGO" | "RECUSADO";

export interface PedidoSaque {
  valor: number;
  disponivel: number;
  idade: number;
  kycAprovado: boolean;
  chavePix: string;
}

export function validarSaque(p: PedidoSaque, f: PlatformConfig["financeiro"]): string[] {
  const erros: string[] = [];
  if (!Number.isFinite(p.valor) || p.valor <= 0) erros.push("Informe o valor do saque.");
  else {
    if (p.valor < f.saqueMinimo) erros.push(`O saque mínimo é R$ ${f.saqueMinimo.toFixed(2).replace(".", ",")}.`);
    if (p.valor > p.disponivel) erros.push("O valor passa do saldo disponível.");
  }
  if (p.idade < f.idadeMinima) erros.push(`Saques só para maiores de ${f.idadeMinima} anos.`);
  if (f.kycObrigatorio && !p.kycAprovado) erros.push("Envie selfie e CPF para liberar o primeiro saque.");
  if (!tipoChavePix(p.chavePix)) erros.push("Chave PIX inválida. Use CPF, telefone, e-mail ou chave aleatória.");
  return erros;
}

/** Até o limite configurado a aprovação é automática; acima disso vai para a fila manual. */
export function statusInicialSaque(valor: number, f: PlatformConfig["financeiro"]): StatusSaque {
  return valor <= f.autoAprovacaoAte ? "APROVADO" : "PENDENTE";
}

export type TipoChavePix = "CPF" | "TELEFONE" | "EMAIL" | "ALEATORIA";

export function tipoChavePix(chave: string): TipoChavePix | null {
  const c = chave.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return "EMAIL";
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c)) return "ALEATORIA";
  // CPF com pontuação é inequívoco; sem máscara, celular válido tem prioridade sobre CPF.
  if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(c)) return cpfValido(c) ? "CPF" : null;
  if (normalizarTelefone(c)) return "TELEFONE";
  if (cpfValido(c)) return "CPF";
  return null;
}

export function cpfValido(cpf: string): boolean {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const calc = (n: number) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}
