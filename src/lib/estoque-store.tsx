"use client";

/**
 * Estoque no navegador (modo demonstração), no mesmo contrato do schema Prisma
 * (Fornecedor, Material, Bobina, MovimentoEstoque). Vem com fornecedores reais de mercado
 * e bobinas de exemplo para o painel abrir preenchido.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { gerarCodigoBobina, registrarBaixa, type Bobina, type EntradaBaixa, type Fornecedor, type Material, type Movimento } from "./estoque";

export interface EstadoEstoque {
  versao: number;
  fornecedores: Fornecedor[];
  materiais: Material[];
  bobinas: Bobina[];
  movimentos: Movimento[];
}

const novoId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

/** Fornecedores e custos publicados (out/2026). Contatos comerciais públicos dos sites de cada empresa. */
export const ESTOQUE_EXEMPLO: EstadoEstoque = {
  versao: 1,
  fornecedores: [
    { id: "hubex", nome: "Hubex", marcas: "3M arquitetura (Safety S40/S70, Prestige)", telefone: "0800 608 2123", whatsapp: "5511992305375", email: "contato@hubex.com.br", site: "hubex.com.br", prazoEntregaDias: 5, observacoes: "Distribuidora oficial 3M; pedir cotação de aplicador." },
    { id: "segvel", nome: "Segvel", marcas: "3M automotivo, Wrap 2080, PPF", telefone: "(11) 5105-0210", email: "contato@segvel.com.br", site: "segvel.com.br", prazoEntregaDias: 5 },
    { id: "signhouse", nome: "Sign House", marcas: "Orafol / Oracal 970 RA", telefone: "(11) 4501-1166", email: "contato@signhouse.com.br", site: "signhouse.com.br", prazoEntregaDias: 4 },
    { id: "vinilsul", nome: "VinilSul", marcas: "Avery Dennison", site: "vinilsul.com.br", prazoEntregaDias: 6 },
    { id: "mcv", nome: "MCV Film", marcas: "PS4000, PS8000 (antivandalismo), insulfilm", telefone: "(19) 4009-1700", site: "mcvfilm.com.br", prazoEntregaDias: 4 },
    { id: "casanissi", nome: "Casa Nissi", marcas: "Insufilm, nano cerâmica, PS8000", site: "casanissi.com.br", prazoEntregaDias: 5 },
  ],
  materiais: [
    { id: "ps8000-fume", nome: "Antivandalismo PS8000 G5 fumê (200 µ)", categoria: "antivandalismo", fornecedorId: "mcv", larguraM: 1.52, estoqueMinimoM2: 30, retalhoMinimoM: 0.5 },
    { id: "ps4000-incolor", nome: "Antivandalismo PS4000 incolor (100 µ)", categoria: "antivandalismo", fornecedorId: "mcv", larguraM: 1.52, estoqueMinimoM2: 30, retalhoMinimoM: 0.5 },
    { id: "nano-ceramica-g5", nome: "Insulfilm nano cerâmica G5", categoria: "insulfilm", fornecedorId: "casanissi", larguraM: 1.52, estoqueMinimoM2: 20, retalhoMinimoM: 0.6 },
    { id: "jateado-branco", nome: "Jateado branco", categoria: "jateado", fornecedorId: "casanissi", larguraM: 1.52, estoqueMinimoM2: 15, retalhoMinimoM: 0.5 },
    { id: "avery-sw900-preto", nome: "Avery SW900 preto fosco", categoria: "envelopamento", fornecedorId: "vinilsul", larguraM: 1.52, estoqueMinimoM2: 25, retalhoMinimoM: 1 },
    { id: "oracal-970-grafite", nome: "Oracal 970 RA grafite", categoria: "envelopamento", fornecedorId: "signhouse", larguraM: 1.52, estoqueMinimoM2: 25, retalhoMinimoM: 1 },
  ],
  bobinas: [
    { id: "b1", codigo: "BOB-20261020-001", materialId: "ps8000-fume", fornecedorId: "mcv", larguraM: 1.52, comprimentoInicialM: 30, comprimentoRestanteM: 21.4, custoTotal: 3960, notaFiscal: "NF 0000", dataEntrada: "2026-10-20", status: "ABERTA" },
    { id: "b2", codigo: "BOB-20261020-002", materialId: "ps8000-fume", fornecedorId: "mcv", larguraM: 1.52, comprimentoInicialM: 30, comprimentoRestanteM: 30, custoTotal: 3960, dataEntrada: "2026-10-20", status: "LACRADA" },
    { id: "b3", codigo: "BOB-20261012-001", materialId: "ps4000-incolor", fornecedorId: "mcv", larguraM: 1.52, comprimentoInicialM: 30, comprimentoRestanteM: 2.6, custoTotal: 2031, dataEntrada: "2026-10-12", status: "ABERTA" },
    { id: "b4", codigo: "BOB-20261015-001", materialId: "nano-ceramica-g5", fornecedorId: "casanissi", larguraM: 1.52, comprimentoInicialM: 30, comprimentoRestanteM: 18.2, custoTotal: 2590, dataEntrada: "2026-10-15", status: "ABERTA" },
    { id: "b5", codigo: "BOB-20261018-001", materialId: "avery-sw900-preto", fornecedorId: "vinilsul", larguraM: 1.52, comprimentoInicialM: 22.86, comprimentoRestanteM: 6.5, custoTotal: 4499, dataEntrada: "2026-10-18", status: "ABERTA" },
    { id: "b5-r", codigo: "BOB-20261018-001-R", materialId: "avery-sw900-preto", fornecedorId: "vinilsul", larguraM: 1.52, comprimentoInicialM: 1.2, comprimentoRestanteM: 1.2, custoTotal: 236.17, dataEntrada: "2026-10-22", status: "ABERTA", origemBobinaId: "b5" },
  ],
  movimentos: [
    { id: "m1", bobinaId: "b1", materialId: "ps8000-fume", tipo: "CONSUMO", data: "2026-10-21", comprimentoM: -4.6, m2Cortado: 6.992, m2Aplicado: 6.1, m2Perda: 0.892, custo: 607.19, referencia: "OS-1021 · Loja Tijuca (vitrine)" },
    { id: "m2", bobinaId: "b1", materialId: "ps8000-fume", tipo: "CONSUMO", data: "2026-10-23", comprimentoM: -4, m2Cortado: 6.08, m2Aplicado: 5.2, m2Perda: 0.88, custo: 527.99, referencia: "OS-1023 · Civic (laterais e traseiro)" },
    { id: "m3", bobinaId: "b5", materialId: "avery-sw900-preto", tipo: "CONSUMO", data: "2026-10-22", comprimentoM: -16.36, m2Cortado: 24.867, m2Aplicado: 21.9, m2Perda: 1.143, custo: 2983.61, referencia: "OS-1022 · Envelopamento total HB20" },
    { id: "m3-r", bobinaId: "b5-r", materialId: "avery-sw900-preto", tipo: "RETALHO", data: "2026-10-22", comprimentoM: 1.2, m2Cortado: 0, m2Aplicado: 0, m2Perda: 0, custo: 236.17, referencia: "OS-1022 · Envelopamento total HB20", observacao: "Sobra do corte da BOB-20261018-001" },
    { id: "m4", bobinaId: "b3", materialId: "ps4000-incolor", tipo: "CONSUMO", data: "2026-10-24", comprimentoM: -27.4, m2Cortado: 41.648, m2Aplicado: 37.5, m2Perda: 4.148, custo: 1855, referencia: "OS-1024 · Fachada condomínio Barra" },
  ],
};

interface NovaBobina {
  materialId: string;
  fornecedorId: string;
  larguraM: number;
  comprimentoM: number;
  custoTotal: number;
  notaFiscal?: string;
  quantidade: number;
}

interface Ctx extends EstadoEstoque {
  pronto: boolean;
  salvarFornecedor: (f: Fornecedor) => void;
  salvarMaterial: (m: Material) => void;
  darEntrada: (n: NovaBobina) => Bobina[];
  darBaixa: (bobinaId: string, e: Omit<EntradaBaixa, "data" | "idMovimento" | "idRetalho" | "codigoRetalho">) => ReturnType<typeof registrarBaixa>;
  ajustar: (bobinaId: string, comprimentoRealM: number, motivo: string) => void;
  restaurarExemplo: () => void;
  novoId: () => string;
}

const EstoqueContext = createContext<Ctx | null>(null);
const CHAVE = "fph.estoque.v1";

const hoje = () => new Date().toISOString().slice(0, 10);

export function EstoqueProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<EstadoEstoque>(ESTOQUE_EXEMPLO);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      const salvo = bruto ? (JSON.parse(bruto) as EstadoEstoque) : null;
      if (salvo && salvo.versao === ESTOQUE_EXEMPLO.versao) setEstado(salvo);
    } catch {
      /* sem armazenamento: segue com o exemplo */
    }
    setPronto(true);
  }, []);

  const gravar = useCallback((novo: EstadoEstoque) => {
    setEstado(novo);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(novo));
    } catch {
      /* armazenamento indisponível */
    }
  }, []);

  const valor = useMemo<Ctx>(() => {
    const upsert = <T extends { id: string }>(lista: T[], item: T) => (lista.some((x) => x.id === item.id) ? lista.map((x) => (x.id === item.id ? item : x)) : [...lista, item]);
    return {
      ...estado,
      pronto,
      novoId,
      salvarFornecedor: (f) => gravar({ ...estado, fornecedores: upsert(estado.fornecedores, f) }),
      salvarMaterial: (m) => gravar({ ...estado, materiais: upsert(estado.materiais, m) }),
      darEntrada: (n) => {
        const d = hoje();
        const prefixo = `BOB-${d.replaceAll("-", "")}-`;
        const seq = estado.bobinas.filter((b) => b.codigo.startsWith(prefixo) && !b.origemBobinaId).length;
        const novas: Bobina[] = Array.from({ length: Math.max(1, n.quantidade) }, (_, i) => ({
          id: novoId(),
          codigo: gerarCodigoBobina(new Date(`${d}T12:00:00`), seq + i + 1),
          materialId: n.materialId,
          fornecedorId: n.fornecedorId,
          larguraM: n.larguraM,
          comprimentoInicialM: n.comprimentoM,
          comprimentoRestanteM: n.comprimentoM,
          custoTotal: n.custoTotal,
          notaFiscal: n.notaFiscal,
          dataEntrada: d,
          status: "LACRADA",
        }));
        const movs: Movimento[] = novas.map((b) => ({
          id: novoId(),
          bobinaId: b.id,
          materialId: b.materialId,
          tipo: "ENTRADA",
          data: d,
          comprimentoM: b.comprimentoInicialM,
          m2Cortado: 0,
          m2Aplicado: 0,
          m2Perda: 0,
          custo: b.custoTotal,
          referencia: n.notaFiscal ? `NF ${n.notaFiscal}` : undefined,
        }));
        gravar({ ...estado, bobinas: [...novas, ...estado.bobinas], movimentos: [...movs, ...estado.movimentos] });
        return novas;
      },
      darBaixa: (bobinaId, e) => {
        const b = estado.bobinas.find((x) => x.id === bobinaId);
        if (!b) throw new Error("Bobina não encontrada.");
        const r = registrarBaixa(b, { ...e, data: hoje(), idMovimento: novoId(), idRetalho: novoId(), codigoRetalho: `${b.codigo}-R${estado.bobinas.filter((x) => x.origemBobinaId === b.id).length + 1}` });
        const bobinas = estado.bobinas.map((x) => (x.id === b.id ? r.bobina : x));
        gravar({
          ...estado,
          bobinas: r.retalho ? [r.retalho, ...bobinas] : bobinas,
          movimentos: [r.movimento, ...(r.movimentoRetalho ? [r.movimentoRetalho] : []), ...estado.movimentos],
        });
        return r;
      },
      ajustar: (bobinaId, comprimentoRealM, motivo) => {
        const b = estado.bobinas.find((x) => x.id === bobinaId);
        if (!b) return;
        const dif = Math.round((comprimentoRealM - b.comprimentoRestanteM) * 1000) / 1000;
        if (dif === 0) return;
        const nova: Bobina = { ...b, comprimentoRestanteM: comprimentoRealM, status: comprimentoRealM <= 0 ? "FINALIZADA" : "ABERTA" };
        const custoM2 = b.custoTotal / (b.larguraM * b.comprimentoInicialM);
        const mov: Movimento = {
          id: novoId(),
          bobinaId,
          materialId: b.materialId,
          tipo: "AJUSTE",
          data: hoje(),
          comprimentoM: dif,
          m2Cortado: 0,
          m2Aplicado: 0,
          m2Perda: dif < 0 ? Math.round(-dif * b.larguraM * 1000) / 1000 : 0,
          custo: Math.round(dif * b.larguraM * custoM2 * 100) / 100,
          observacao: motivo,
        };
        gravar({ ...estado, bobinas: estado.bobinas.map((x) => (x.id === bobinaId ? nova : x)), movimentos: [mov, ...estado.movimentos] });
      },
      restaurarExemplo: () => gravar(ESTOQUE_EXEMPLO),
    };
  }, [estado, pronto, gravar]);

  return <EstoqueContext.Provider value={valor}>{children}</EstoqueContext.Provider>;
}

export function useEstoque() {
  const c = useContext(EstoqueContext);
  if (!c) throw new Error("useEstoque precisa do EstoqueProvider");
  return c;
}
