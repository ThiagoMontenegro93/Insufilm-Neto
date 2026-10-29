import { describe, expect, it } from "vitest";
import { CONFIG_PADRAO } from "../config";
import { calcularSplit, precoEnvelopamento, precoLinhas } from "../pricing";
import { gerarCodigoIndicacao, lerCodigoIndicacao, normalizarTelefone, mascararTelefone } from "../referral";
import { statusInicialSaque, tipoChavePix, validarSaque } from "../payout";
import { cnpjValido, podeProspectar, pontuarLead, type Lead } from "../prospect";

// Preços fixos para testar o motor de orçamento sem depender dos custos de exemplo.
const cfg = structuredClone(CONFIG_PADRAO);
const fixar = (lista: { id: string; preco: number }[], precos: Record<string, number>) => lista.forEach((i) => i.id in precos && (i.preco = precos[i.id]));
fixar(cfg.servicos.envelopamento.marcas, { "3m-1080": 120 });
fixar(cfg.servicos.arquitetonico, { parede: 90, geladeira: 650 });

describe("split", () => {
  it("R$1.000 = 300 plataforma + 50 indicador + 650 locatário", () => {
    expect(calcularSplit(1000, cfg.taxas)).toMatchObject({ plataforma: 300, indicador: 50, locatario: 650 });
  });
  it("Civic total fosco 3M: 15 m² × (120 + 10) = 1.950 → 585 + 97,50", () => {
    const p = precoEnvelopamento(cfg, "3m-1080", "fosco", 15);
    expect(p.total).toBe(1950);
    expect(calcularSplit(p.total, cfg.taxas)).toMatchObject({ plataforma: 585, indicador: 97.5, locatario: 1267.5 });
  });
  it("Geladeira valor fixo 650 → 195 + 32,50", () => {
    const r = precoLinhas(cfg.servicos.arquitetonico, [{ itemId: "geladeira", quantidade: 1 }]);
    expect(r.total).toBe(650);
    expect(calcularSplit(r.total, cfg.taxas)).toMatchObject({ plataforma: 195, indicador: 32.5 });
  });
  it("Parede 3 × 2 m = 6 m² × 90 = 540 → 162 + 27", () => {
    const r = precoLinhas(cfg.servicos.arquitetonico, [{ itemId: "parede", largura: 3, altura: 2, quantidade: 1 }]);
    expect(r.total).toBe(540);
    expect(calcularSplit(r.total, cfg.taxas)).toMatchObject({ plataforma: 162, indicador: 27 });
  });
  it("sem indicação, o indicador fica com zero e a soma fecha", () => {
    const s = calcularSplit(999.99, cfg.taxas, { comIndicacao: false, descontoPct: 10 });
    expect(s.indicador).toBe(0);
    expect(Math.round((s.plataforma + s.locatario) * 100)).toBe(Math.round(s.liquido * 100));
  });
});

describe("indicação", () => {
  it("normaliza telefone com máscara e DDI", () => {
    expect(normalizarTelefone("+55 (21) 99999-8888")).toBe("21999998888");
    expect(normalizarTelefone("21 3333-4444")).toBe("2133334444");
    expect(normalizarTelefone("999")).toBeNull();
    expect(mascararTelefone("21999998888")).toBe("(21) 99999-8888");
  });
  it("gera e lê o código IND-20240512-JORG-001", () => {
    const c = gerarCodigoIndicacao("JORG", new Date(2024, 4, 12), 1);
    expect(c).toBe("IND-20240512-JORG-001");
    expect(lerCodigoIndicacao(c)).toEqual({ data: "20240512", parceiro: "JORG", sequencial: 1 });
  });
});

describe("saque PIX", () => {
  const base = { valor: 100, disponivel: 200, idade: 30, kycAprovado: true, chavePix: "11988887777" };
  it("aceita um saque válido", () => expect(validarSaque(base, cfg.financeiro)).toEqual([]));
  it("barra abaixo do mínimo, acima do saldo, menor de idade e sem KYC", () => {
    expect(validarSaque({ ...base, valor: 10 }, cfg.financeiro)).toHaveLength(1);
    expect(validarSaque({ ...base, valor: 300 }, cfg.financeiro)).toHaveLength(1);
    expect(validarSaque({ ...base, idade: 17 }, cfg.financeiro)).toHaveLength(1);
    expect(validarSaque({ ...base, kycAprovado: false }, cfg.financeiro)).toHaveLength(1);
  });
  it("aprova automático até R$100", () => {
    expect(statusInicialSaque(100, cfg.financeiro)).toBe("APROVADO");
    expect(statusInicialSaque(100.01, cfg.financeiro)).toBe("PENDENTE");
  });
  it("identifica tipos de chave", () => {
    expect(tipoChavePix("11988887777")).toBe("TELEFONE");
    expect(tipoChavePix("529.982.247-25")).toBe("CPF");
    expect(tipoChavePix("jorge@exemplo.com")).toBe("EMAIL");
    expect(tipoChavePix("abc")).toBeNull();
  });
});

describe("prospecção", () => {
  const lead: Lead = {
    id: "1", empresa: "Mecânica do Paulo", endereco: "Rua Conde de Bonfim, 100", categoria: "oficina",
    site: "mecanicadopaulo.com.br", email: "contato@mecanicadopaulo.com.br", whatsapp: "21999998888",
    google: { encontrado: true, avaliacao: 4.7, totalAvaliacoes: 89 }, siteOficial: { acessado: true },
  };
  it("pontua 100 com as duas validações completas", () => expect(pontuarLead(lead).total).toBe(100));
  it("bloqueia sem site oficial, com score baixo ou opt-out", () => {
    expect(podeProspectar({ ...lead, siteOficial: { acessado: false } }, 70).ok).toBe(false);
    expect(podeProspectar({ ...lead, optOut: true }, 70).ok).toBe(false);
    expect(podeProspectar(lead, 70).ok).toBe(true);
  });
  it("valida CNPJ", () => {
    expect(cnpjValido("11.222.333/0001-81")).toBe(true);
    expect(cnpjValido("12.345.678/0001-90")).toBe(false);
  });
});
