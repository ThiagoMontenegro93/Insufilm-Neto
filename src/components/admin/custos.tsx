"use client";

/**
 * Aba "Custos" do Creator Hub: o valor que a JR paga ao fornecedor vira o preço das calculadoras.
 * Para cada item: fornecedor, R$/m² do material (direto ou pela nota da bobina), perda e mão de obra.
 * As premissas (impostos, comissão, margem, cartão) valem para todos os itens.
 */
import { useEffect, useMemo, useState } from "react";
import { Calculator, Package, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cartao, Interruptor, Selo } from "@/components/ui/primitivos";
import { usePlataforma } from "@/lib/store";
import type { CustoItem, PlatformConfig } from "@/lib/config";
import { comissaoNoPreco, custoM2DaBobina, precoPeloCusto } from "@/lib/custos";
import { lerEstoqueSalvo } from "@/lib/estoque-store";
import { saldoPorMaterial } from "@/lib/estoque";
import { brl } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Rascunho = Pick<PlatformConfig, "servicos" | "precificacao">;
type Grupo = "peliculaSeguranca" | "marcas" | "arquitetonico" | "antivandalismo";

/** Uma linha editável, seja item de calculadora ou linha de antivandalismo. */
interface Linha {
  grupo: Grupo;
  id: string;
  nome: string;
  porUnidade: boolean;
  unidade: string;
  precoAtual: number;
  custo: CustoItem;
}

const CUSTO_VAZIO: CustoItem = { automatico: false, fornecedor: "", materialM2: 0, perdaPct: 12, maoDeObra: 0 };

const GRUPOS: { id: Grupo; titulo: string; onde: string }[] = [
  { id: "peliculaSeguranca", titulo: "Película de segurança", onde: "/pelicula" },
  { id: "marcas", titulo: "Envelopamento automotivo", onde: "/envelopamento" },
  { id: "arquitetonico", titulo: "Superfícies", onde: "/arquitetonico" },
  { id: "antivandalismo", titulo: "Antivandalismo", onde: "/antivandalismo" },
];

function linhasDo(r: Rascunho, g: Grupo): Linha[] {
  const s = r.servicos;
  if (g === "antivandalismo")
    return s.antivandalismo.map((l) => ({
      grupo: g,
      id: l.id,
      nome: l.nome,
      porUnidade: l.unidade === "veiculo",
      unidade: l.unidade === "veiculo" ? "carro" : "m²",
      precoAtual: l.precoVista,
      custo: l.custo ?? CUSTO_VAZIO,
    }));
  const lista = g === "marcas" ? s.envelopamento.marcas : s[g];
  return lista.map((i) => ({
    grupo: g,
    id: i.id,
    nome: i.nome,
    porUnidade: i.unidade === "fixo",
    unidade: i.unidade === "fixo" ? "unidade" : "m²",
    precoAtual: i.preco,
    custo: i.custo ?? CUSTO_VAZIO,
  }));
}

function comCusto(r: Rascunho, g: Grupo, id: string, custo: CustoItem): Rascunho {
  const s = structuredClone(r.servicos);
  if (g === "antivandalismo") s.antivandalismo = s.antivandalismo.map((l) => (l.id === id ? { ...l, custo } : l));
  else if (g === "marcas") s.envelopamento.marcas = s.envelopamento.marcas.map((i) => (i.id === id ? { ...i, custo } : i));
  else s[g] = s[g].map((i) => (i.id === id ? { ...i, custo } : i));
  return { ...r, servicos: s };
}

function Num({ id, rotulo, valor, onChange, prefixo, sufixo, passo = 0.01, className }: { id: string; rotulo: string; valor: number; onChange: (n: number) => void; prefixo?: string; sufixo?: string; passo?: number; className?: string }) {
  return (
    <label htmlFor={id} className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="rotulo">{rotulo}</span>
      <span className="relative">
        {prefixo && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-tx4">{prefixo}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={passo}
          value={Number.isFinite(valor) ? valor : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn("campo num py-2.5 font-mono text-sm", prefixo && "pl-9", sufixo && "pr-9")}
        />
        {sufixo && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-tx4">{sufixo}</span>}
      </span>
    </label>
  );
}

/** Calculadora da nota: preço pago na bobina ÷ m² da bobina. */
function PelaBobina({ id, onAplicar }: { id: string; onAplicar: (custoM2: number) => void }) {
  const [b, setB] = useState({ preco: 3960, largura: 1.52, comprimento: 30 });
  const v = custoM2DaBobina(b.preco, b.largura, b.comprimento);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ouro/25 bg-ouro/[0.05] p-4">
      <p className="text-xs text-tx3">Digite o que você pagou na bobina e o tamanho dela. O sistema divide pelo m² e preenche o custo do material.</p>
      <div className="grid grid-cols-3 gap-2">
        <Num id={`${id}-bp`} rotulo="Valor pago" prefixo="R$" passo={1} valor={b.preco} onChange={(n) => setB({ ...b, preco: n })} />
        <Num id={`${id}-bl`} rotulo="Largura" sufixo="m" valor={b.largura} onChange={(n) => setB({ ...b, largura: n })} />
        <Num id={`${id}-bc`} rotulo="Comprimento" sufixo="m" passo={0.5} valor={b.comprimento} onChange={(n) => setB({ ...b, comprimento: n })} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="num font-mono text-sm text-tx">
          {Math.round(b.largura * b.comprimento * 100) / 100} m² → <b className="text-ouro">{brl(v)}/m²</b>
        </span>
        <Button tamanho="sm" variante="contorno" disabled={v <= 0} onClick={() => onAplicar(v)}>
          Usar {brl(v)}/m²
        </Button>
      </div>
    </div>
  );
}

export function AbaCustos() {
  const { config, alterar } = usePlataforma();
  const original = useMemo<Rascunho>(() => ({ servicos: config.servicos, precificacao: config.precificacao }), [config]);
  const [r, setR] = useState<Rascunho>(original);
  useEffect(() => setR(original), [original]);
  const sujo = JSON.stringify(r) !== JSON.stringify(original);
  const [aberta, setAberta] = useState<string | null>(null);

  // custo médio por m² das bobinas em estoque, para puxar com um clique
  const [estoque, setEstoque] = useState<{ id: string; nome: string; fornecedor: string; custoM2: number }[]>([]);
  const [fornecedores, setFornecedores] = useState<string[]>([]);
  useEffect(() => {
    const e = lerEstoqueSalvo();
    const saldo = saldoPorMaterial(e.bobinas);
    setEstoque(
      e.materiais
        .filter((m) => saldo[m.id]?.custoMedioM2)
        .map((m) => ({ id: m.id, nome: m.nome, fornecedor: e.fornecedores.find((f) => f.id === m.fornecedorId)?.nome ?? "", custoM2: saldo[m.id].custoMedioM2 })),
    );
    setFornecedores(e.fornecedores.map((f) => f.nome));
  }, []);

  const p = r.precificacao;
  const comissao = comissaoNoPreco(config.taxas, p);
  const sobra = 100 - p.impostosPct - comissao - p.margemPct;
  const editarP = (campo: keyof typeof p, v: number | boolean) => setR({ ...r, precificacao: { ...p, [campo]: v } });

  const salvar = () =>
    alterar("Custos de material e premissas de preço alterados", (c) => {
      c.servicos = structuredClone(r.servicos);
      c.precificacao = structuredClone(r.precificacao);
    });

  return (
    <div className="flex flex-col gap-5">
      <Cartao forte className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 font-semibold text-tx">
            <Calculator className="h-4 w-4 text-ouro" aria-hidden /> Como o preço é calculado
          </h3>
          <p className="text-sm text-tx3">
            Preço PIX = (material do fornecedor × perda + mão de obra) ÷ (100% − impostos − comissão − margem). O cartão desconta também a taxa da maquininha. Itens com &quot;Preço pelo custo&quot; ligado são reprecificados sozinhos quando você muda qualquer valor aqui.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Num id="pr-imp" rotulo="Impostos" sufixo="%" passo={0.5} valor={p.impostosPct} onChange={(n) => editarP("impostosPct", n)} />
          <Num id="pr-mar" rotulo="Sua margem" sufixo="%" passo={0.5} valor={p.margemPct} onChange={(n) => editarP("margemPct", n)} />
          <Num id="pr-car" rotulo="Taxa do cartão" sufixo="%" passo={0.5} valor={p.taxaCartaoPct} onChange={(n) => editarP("taxaCartaoPct", n)} />
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="rotulo">Comissão</span>
            <span className="num flex h-[42px] items-center rounded-xl border border-linha/10 px-3 font-mono text-sm text-tx">{comissao}%</span>
          </div>
          <label htmlFor="pr-arr" className="flex min-w-0 flex-col gap-1.5">
            <span className="rotulo">Arredondar para</span>
            <select id="pr-arr" className="campo py-2.5 text-sm" value={p.arredondarPara} onChange={(e) => editarP("arredondarPara", Number(e.target.value))}>
              <option value={1}>R$ 1</option>
              <option value={5}>R$ 5</option>
              <option value={10}>R$ 10</option>
            </select>
          </label>
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="rotulo">Sobra p/ custo</span>
            <span className={cn("num flex h-[42px] items-center rounded-xl border px-3 font-mono text-sm", sobra > 0 ? "border-linha/10 text-tx" : "border-perigo/40 text-perigo")}>{sobra}%</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-linha/[0.08] p-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium text-tx">Incluir a comissão do indicador ({config.taxas.indicadorPct}%) no preço</span>
            <span className="text-xs text-tx4">A comissão da plataforma ({config.taxas.plataformaPct}%) vem da aba Geral. Ligue esta opção para a margem se manter também nas vendas indicadas.</span>
          </div>
          <Interruptor id="pr-ind" rotulo="Incluir comissão do indicador" ligado={p.incluirIndicador} onChange={(v) => editarP("incluirIndicador", v)} />
        </div>
      </Cartao>

      {GRUPOS.map((g) => (
        <Cartao key={g.id} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold text-tx">{g.titulo}</h3>
            <span className="font-mono text-xs text-tx4">alimenta {g.onde}</span>
          </div>
          <ul className="flex flex-col divide-y divide-linha/[0.06]">
            {linhasDo(r, g.id).map((l) => {
              const c = l.custo;
              const res = precoPeloCusto(c, l.porUnidade, config.taxas, p);
              const set = (parcial: Partial<CustoItem>) => setR(comCusto(r, l.grupo, l.id, { ...c, ...parcial }));
              const chave = `${l.grupo}-${l.id}`;
              return (
                <li key={chave} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="font-medium text-tx">{l.nome}</span>
                      <span className="text-xs text-tx4">preço por {l.unidade}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Selo tom={c.automatico ? "neon" : "neutro"}>{c.automatico ? "Preço pelo custo" : "Preço manual"}</Selo>
                      <Interruptor id={`auto-${chave}`} rotulo={`Calcular o preço de ${l.nome} pelo custo`} ligado={c.automatico} onChange={(v) => set({ automatico: v })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-[1.4fr_1fr_0.7fr_1fr_0.8fr]">
                    <label htmlFor={`forn-${chave}`} className="col-span-2 flex min-w-0 flex-col gap-1.5 sm:col-span-1">
                      <span className="rotulo">Fornecedor</span>
                      <input id={`forn-${chave}`} list="lista-fornecedores" className="campo py-2.5 text-sm" value={c.fornecedor} placeholder="Ex.: MCV Film" onChange={(e) => set({ fornecedor: e.target.value })} />
                    </label>
                    <Num id={`mat-${chave}`} rotulo="Material (R$/m²)" prefixo="R$" valor={c.materialM2} onChange={(n) => set({ materialM2: n })} />
                    <Num id={`perda-${chave}`} rotulo="Perda" sufixo="%" passo={1} valor={c.perdaPct} onChange={(n) => set({ perdaPct: n })} />
                    <Num id={`mo-${chave}`} rotulo={`Mão de obra (/${l.unidade})`} prefixo="R$" passo={5} valor={c.maoDeObra} onChange={(n) => set({ maoDeObra: n })} />
                    {l.porUnidade ? (
                      <Num id={`m2u-${chave}`} rotulo={`m² por ${l.unidade}`} sufixo="m²" passo={0.1} valor={c.m2PorUnidade ?? 0} onChange={(n) => set({ m2PorUnidade: n })} />
                    ) : (
                      <span className="hidden xl:block" aria-hidden />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button tamanho="sm" variante="fantasma" onClick={() => setAberta(aberta === chave ? null : chave)} aria-expanded={aberta === chave}>
                      <Calculator className="h-3.5 w-3.5" aria-hidden /> Pela nota da bobina
                    </Button>
                    {estoque.length > 0 && (
                      <label className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-tx4" aria-hidden />
                        <span className="sr-only">Puxar custo médio do estoque</span>
                        <select
                          id={`est-${chave}`}
                          className="campo w-auto max-w-[260px] py-1.5 text-xs"
                          value=""
                          onChange={(e) => {
                            const m = estoque.find((x) => x.id === e.target.value);
                            if (m) set({ materialM2: m.custoM2, fornecedor: m.fornecedor || c.fornecedor });
                          }}
                        >
                          <option value="">Puxar custo médio do estoque…</option>
                          {estoque.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.nome} · {brl(m.custoM2)}/m²
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                  {aberta === chave && (
                    <PelaBobina
                      id={`bob-${chave}`}
                      onAplicar={(v) => {
                        set({ materialM2: v });
                        setAberta(null);
                      }}
                    />
                  )}

                  <dl className="grid grid-cols-2 gap-2 rounded-2xl bg-linha/[0.03] p-3 sm:grid-cols-5">
                    {[
                      { k: "Material c/ perda", v: brl(res.material) },
                      { k: "Custo direto", v: brl(res.custoDireto) },
                      { k: "Preço PIX", v: res.viavel ? brl(res.pix) : "inviável", forte: true },
                      { k: "Preço cartão", v: res.viavel ? brl(res.cartao) : "inviável" },
                      { k: "Sua margem", v: res.viavel ? brl(res.margem) : "—", verde: true },
                    ].map((x) => (
                      <div key={x.k} className="flex min-w-0 flex-col gap-0.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-tx4">{x.k}</dt>
                        <dd className={cn("num font-mono text-sm", x.forte ? "font-bold text-ouro" : x.verde ? "text-esmeralda-soft" : "text-tx")}>{x.v}</dd>
                      </div>
                    ))}
                  </dl>
                  {!c.automatico && (
                    <p className="text-xs text-tx4">
                      Hoje o site usa o preço manual{" "}
                      <b className="text-tx2">{l.precoAtual > 0 ? brl(l.precoAtual) : "sob consulta"}</b>. Ligue &quot;Preço pelo custo&quot; para passar a usar {res.viavel ? brl(res.pix) : "o preço calculado"}.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Cartao>
      ))}

      <datalist id="lista-fornecedores">
        {fornecedores.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>

      <div className={cn("sticky bottom-24 z-10 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-linha/10 bg-noite/90 p-3 backdrop-blur lg:bottom-4", !sujo && "opacity-60")}>
        {sujo && <span className="mr-auto text-sm text-alerta">Alterações não salvas</span>}
        <Button variante="fantasma" tamanho="sm" disabled={!sujo} onClick={() => setR(original)}>
          Descartar
        </Button>
        <Button tamanho="sm" disabled={!sujo} onClick={salvar}>
          <Save className="h-4 w-4" aria-hidden /> Salvar e reprecificar
        </Button>
      </div>
    </div>
  );
}
