import { describe, expect, it } from "vitest";
import { CONFIG_PADRAO, type CustoItem } from "../config";
import { custoM2DaBobina, precoPeloCusto, recalcularPrecos } from "../custos";

const taxas = { plataformaPct: 30, indicadorPct: 5, mensalidadeFilial: 97, descontoCupomPct: 0 };
const premissas = { impostosPct: 6, margemPct: 15, taxaCartaoPct: 9, incluirIndicador: false, arredondarPara: 1 };
const ps8000: CustoItem = { automatico: true, fornecedor: "MCV Film", materialM2: 87, perdaPct: 15, maoDeObra: 50 };

describe("preço pelo custo do fornecedor", () => {
  it("bobina de R$ 3.960 com 1,52 × 30 m custa R$ 86,84 o m²", () => {
    expect(custoM2DaBobina(3960, 1.52, 30)).toBe(86.84);
  });

  it("PS8000 a R$ 87/m²: custo direto 150,05; PIX 307 e cartão 376 (arredondados para cima)", () => {
    const r = precoPeloCusto(ps8000, false, taxas, premissas);
    expect(r.custoDireto).toBe(150.05);
    expect(r.pix).toBe(307); // 150,05 ÷ 0,49 = 306,22
    expect(r.cartao).toBe(376); // 150,05 ÷ 0,40 = 375,13
    expect(r.deducoesPct).toBe(36);
  });

  it("incluir o indicador aumenta o preço para manter a margem", () => {
    const sem = precoPeloCusto(ps8000, false, taxas, premissas).pix;
    const com = precoPeloCusto(ps8000, false, taxas, { ...premissas, incluirIndicador: true }).pix;
    expect(com).toBeGreaterThan(sem);
    expect(com).toBe(342); // 150,05 ÷ 0,44 = 341,02, arredondado para cima
  });

  it("item de valor fechado multiplica o material pelos m² da unidade", () => {
    const geladeira: CustoItem = { automatico: true, fornecedor: "JC Decor", materialM2: 45, perdaPct: 20, maoDeObra: 220, m2PorUnidade: 5 };
    const r = precoPeloCusto(geladeira, true, taxas, { ...premissas, arredondarPara: 5 });
    expect(r.material).toBe(270);
    expect(r.custoDireto).toBe(490);
    expect(r.pix).toBe(1000); // 490 ÷ 0,49 = 1000
  });

  it("deduções acima de 100% não geram preço", () => {
    const r = precoPeloCusto(ps8000, false, taxas, { ...premissas, margemPct: 70 });
    expect(r.viavel).toBe(false);
    expect(r.pix).toBe(0);
  });

  it("recalcula só os itens automáticos e reprecifica ao mudar a margem", () => {
    const cfg = structuredClone(CONFIG_PADRAO);
    const jateada = cfg.servicos.peliculaSeguranca.find((i) => i.id === "jateada")!;
    const antes = jateada.preco;
    cfg.precificacao.margemPct = 25;
    recalcularPrecos(cfg);
    expect(jateada.preco).toBeGreaterThan(antes);

    const manual = cfg.servicos.arquitetonico.find((i) => i.id === "porta")!;
    manual.custo!.automatico = false;
    manual.preco = 180;
    recalcularPrecos(cfg);
    expect(manual.preco).toBe(180);
  });

  it("antivandalismo segue sob consulta enquanto o preço pelo custo estiver desligado", () => {
    expect(CONFIG_PADRAO.servicos.antivandalismo.every((l) => l.precoVista === 0)).toBe(true);
    const cfg = structuredClone(CONFIG_PADRAO);
    const casa = cfg.servicos.antivandalismo.find((l) => l.id === "casa")!;
    casa.custo!.automatico = true;
    recalcularPrecos(cfg);
    expect(casa.precoVista).toBeGreaterThan(0);
    expect(casa.precoCartao).toBeGreaterThan(casa.precoVista);
  });
});

describe("preço por porte de veículo", () => {
  it("cada porte tem id único e caminhão começa sob consulta", () => {
    const { portes } = CONFIG_PADRAO.servicos;
    expect(new Set(portes.map((p) => p.id)).size).toBe(portes.length);
    const caminhao = portes.find((p) => p.id === "caminhao")!;
    expect(caminhao.precoInsulfilm).toBe(0);
    expect(caminhao.m2Envelopamento).toBe(0);
  });

  it("reprecificar pelo custo não mexe nos preços por porte", () => {
    const c = structuredClone(CONFIG_PADRAO);
    c.servicos.portes[0].precoInsulfilm = 333;
    c.precificacao.margemPct = 25;
    expect(recalcularPrecos(c).servicos.portes[0].precoInsulfilm).toBe(333);
  });
});
