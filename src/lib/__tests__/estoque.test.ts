import { describe, expect, it } from "vitest";
import { alertas, custoM2Bobina, gerarCodigoBobina, precoSugeridoM2, registrarBaixa, saldoPorMaterial, sugerirCorte, type Bobina, type Material } from "../estoque";

const bobina = (o: Partial<Bobina> = {}): Bobina => ({
  id: "b1",
  codigo: "BOB-20261025-001",
  materialId: "ps8000",
  fornecedorId: "mcv",
  larguraM: 1.52,
  comprimentoInicialM: 30,
  comprimentoRestanteM: 30,
  custoTotal: 3960,
  dataEntrada: "2026-10-25",
  status: "LACRADA",
  ...o,
});

describe("estoque por bobina", () => {
  it("custo por m² de uma bobina 30 × 1,52 de R$ 3.960 é R$ 86,84", () => {
    expect(custoM2Bobina(bobina())).toBe(86.84);
  });

  it("gera código BOB-AAAAMMDD-NNN", () => {
    expect(gerarCodigoBobina(new Date(2026, 9, 25), 7)).toBe("BOB-20261025-007");
  });

  it("sugere corte com margem de perda, arredondado para cima em 10 cm", () => {
    // 6 m² + 12% = 6,72 m² ÷ 1,52 = 4,42 → 4,5 m
    expect(sugerirCorte(6, 1.52, 12)).toBe(4.5);
  });

  it("baixa calcula m² cortado, perda, custo e abre a bobina", () => {
    const r = registrarBaixa(bobina(), { areaAplicadaM2: 6, comprimentoCortadoM: 4.5, data: "2026-10-25", idMovimento: "m1", referencia: "OS-1" });
    expect(r.bobina.comprimentoRestanteM).toBe(25.5);
    expect(r.bobina.status).toBe("ABERTA");
    expect(r.movimento.m2Cortado).toBe(6.84);
    expect(r.movimento.m2Perda).toBe(0.84);
    expect(r.perdaPct).toBe(12);
    expect(r.movimento.custo).toBe(593.99);
  });

  it("retalho volta ao estoque e não conta como perda nem custo do serviço", () => {
    const r = registrarBaixa(bobina(), { areaAplicadaM2: 3, comprimentoCortadoM: 3, retalhoM: 0.8, data: "2026-10-25", idMovimento: "m2" });
    expect(r.retalho?.comprimentoRestanteM).toBe(0.8);
    expect(r.retalho?.origemBobinaId).toBe("b1");
    expect(r.movimento.m2Perda).toBe(0.344);
    expect(r.movimento.custo).toBe(290.39);
  });

  it("bloqueia corte maior que o restante e área maior que o cortado", () => {
    expect(() => registrarBaixa(bobina({ comprimentoRestanteM: 2 }), { areaAplicadaM2: 1, comprimentoCortadoM: 3, data: "", idMovimento: "x" })).toThrow(/só tem 2.00 m/);
    expect(() => registrarBaixa(bobina(), { areaAplicadaM2: 10, comprimentoCortadoM: 3, data: "", idMovimento: "x" })).toThrow(/não pode passar/);
  });

  it("finaliza a bobina quando o corte usa tudo", () => {
    const r = registrarBaixa(bobina({ comprimentoRestanteM: 2 }), { areaAplicadaM2: 2.5, comprimentoCortadoM: 2, data: "", idMovimento: "x" });
    expect(r.bobina.status).toBe("FINALIZADA");
  });

  it("saldo soma m² e valor das bobinas ativas e calcula custo médio ponderado", () => {
    const s = saldoPorMaterial([bobina(), bobina({ id: "b2", custoTotal: 2031, comprimentoRestanteM: 15 }), bobina({ id: "b3", status: "FINALIZADA" })]);
    expect(s.ps8000.m2).toBe(68.4);
    expect(s.ps8000.bobinas).toBe(2);
    expect(s.ps8000.custoMedioM2).toBe(72.74);
  });

  it("alerta estoque mínimo e bobina acabando", () => {
    const mat: Material[] = [{ id: "ps8000", nome: "PS8000", categoria: "antivandalismo", fornecedorId: "mcv", larguraM: 1.52, estoqueMinimoM2: 20, retalhoMinimoM: 0.5 }];
    const a = alertas(mat, [bobina({ comprimentoRestanteM: 2 })], []);
    expect(a.map((x) => x.tipo).sort()).toEqual(["BOBINA_ACABANDO", "ESTOQUE_MINIMO"]);
  });

  it("preço sugerido segue custo direto ÷ (1 − impostos − comissão − margem)", () => {
    const p = precoSugeridoM2(87, { perdaPct: 15, maoDeObraM2: 50, impostosPct: 6, comissaoPct: 30, margemPct: 15, taxaCartaoPct: 9 });
    expect(p.custoDireto).toBe(150.05);
    expect(p.pix).toBe(306.22);
    expect(p.cartao).toBe(375.13);
  });
});
