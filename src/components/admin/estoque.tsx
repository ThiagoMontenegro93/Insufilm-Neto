"use client";

/**
 * Estoque por bobina: painel, bobinas, baixa por serviço, entrada de bobina,
 * fornecedores, materiais, movimentações e precificação a partir do custo real.
 */
import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AlertTriangle, ArrowDownToLine, CheckCircle2, PackagePlus, RotateCcw, Ruler, Scissors, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarraProgresso, Campo, Cartao, Selo } from "@/components/ui/primitivos";
import { brl } from "@/lib/pricing";
import { usePlataforma } from "@/lib/store";
import { EstoqueProvider, useEstoque } from "@/lib/estoque-store";
import {
  CATEGORIAS,
  alertas as calcularAlertas,
  custoM2Bobina,
  m2,
  m2Restante,
  pctRestante,
  precoSugeridoM2,
  saldoPorMaterial,
  sugerirCorte,
  type Bobina,
  type CategoriaMaterial,
  type Fornecedor,
  type Material,
} from "@/lib/estoque";
import { cn } from "@/lib/utils";

const ABAS = [
  { id: "painel", rotulo: "Painel" },
  { id: "baixa", rotulo: "Dar baixa" },
  { id: "bobinas", rotulo: "Bobinas" },
  { id: "entrada", rotulo: "Entrada" },
  { id: "fornecedores", rotulo: "Fornecedores" },
  { id: "materiais", rotulo: "Materiais" },
  { id: "movimentos", rotulo: "Movimentações" },
  { id: "precos", rotulo: "Precificação" },
] as const;

const fmtM2 = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m²`;
const fmtM = (n: number) => `${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;
const nomeCategoria = (c: CategoriaMaterial) => CATEGORIAS.find((x) => x.id === c)?.nome ?? c;
const perdaPadrao = (c?: CategoriaMaterial) => CATEGORIAS.find((x) => x.id === c)?.perdaPadraoPct ?? 15;

function Numero({ id, rotulo, valor, onChange, sufixo, prefixo, passo = 0.1, dica }: { id: string; rotulo: string; valor: number; onChange: (n: number) => void; sufixo?: string; prefixo?: string; passo?: number; dica?: string }) {
  return (
    <Campo rotulo={rotulo} htmlFor={id} dica={dica}>
      <div className="relative">
        {prefixo && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-tx4">{prefixo}</span>}
        <input id={id} type="number" inputMode="decimal" min={0} step={passo} value={Number.isFinite(valor) ? valor : 0} onChange={(e) => onChange(Number(e.target.value))} className={cn("campo num font-mono", prefixo && "pl-11", sufixo && "pr-12")} />
        {sufixo && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-tx4">{sufixo}</span>}
      </div>
    </Campo>
  );
}

function Texto({ id, rotulo, valor, onChange, placeholder }: { id: string; rotulo: string; valor: string; onChange: (s: string) => void; placeholder?: string }) {
  return (
    <Campo rotulo={rotulo} htmlFor={id}>
      <input id={id} className="campo" value={valor} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Campo>
  );
}

function rotuloBobina(b: Bobina, materiais: Material[]) {
  const m = materiais.find((x) => x.id === b.materialId);
  return `${b.codigo}${b.origemBobinaId ? " (retalho)" : ""} · ${m?.nome ?? "?"} · ${fmtM(b.comprimentoRestanteM)}`;
}

/* ---------------- PAINEL ---------------- */
function AbaPainel({ irPara }: { irPara: (aba: string) => void }) {
  const { materiais, bobinas, movimentos, fornecedores } = useEstoque();
  const saldo = saldoPorMaterial(bobinas);
  const al = calcularAlertas(materiais, bobinas, movimentos);
  const totalM2 = Object.values(saldo).reduce((a, s) => a + s.m2, 0);
  const totalValor = Object.values(saldo).reduce((a, s) => a + s.valor, 0);
  const consumos = movimentos.filter((m) => m.tipo === "CONSUMO");
  const cortado = consumos.reduce((a, m) => a + m.m2Cortado, 0);
  const perda = consumos.reduce((a, m) => a + m.m2Perda, 0);
  const ativas = bobinas.filter((b) => b.status !== "FINALIZADA");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { r: "Em estoque", v: fmtM2(totalM2), d: `${ativas.length} bobinas e retalhos ativos` },
          { r: "Valor em estoque", v: brl(totalValor), d: "pelo custo de compra de cada bobina" },
          { r: "Perda nos cortes", v: cortado > 0 ? `${Math.round((perda / cortado) * 100)}%` : "–", d: `${fmtM2(Math.round(perda * 100) / 100)} perdidos em ${consumos.length} serviços` },
          { r: "Alertas", v: String(al.length), d: al.length ? "veja abaixo o que repor" : "tudo dentro do mínimo" },
        ].map((k) => (
          <Cartao key={k.r} className="flex flex-col gap-1.5">
            <span className="rotulo">{k.r}</span>
            <span className="num text-2xl font-bold text-tx">{k.v}</span>
            <span className="text-xs text-tx4">{k.d}</span>
          </Cartao>
        ))}
      </div>

      {al.length > 0 && (
        <Cartao className="flex flex-col gap-3 border-alerta/30">
          <h3 className="flex items-center gap-2 font-semibold text-alerta">
            <AlertTriangle className="h-4 w-4" aria-hidden /> O que precisa de atenção
          </h3>
          <ul className="flex flex-col gap-2">
            {al.map((a, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2 text-sm text-tx2">
                <Selo tom={a.tipo === "PERDA_ALTA" ? "perigo" : "alerta"}>{a.tipo === "ESTOQUE_MINIMO" ? "Repor" : a.tipo === "BOBINA_ACABANDO" ? "Acabando" : "Perda alta"}</Selo>
                {a.mensagem}
              </li>
            ))}
          </ul>
        </Cartao>
      )}

      <Cartao className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-tx">Saldo por material</h3>
          <div className="flex gap-2">
            <Button tamanho="sm" onClick={() => irPara("baixa")}>
              <Scissors className="h-4 w-4" aria-hidden /> Dar baixa
            </Button>
            <Button tamanho="sm" variante="contorno" onClick={() => irPara("entrada")}>
              <PackagePlus className="h-4 w-4" aria-hidden /> Entrada de bobina
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-linha/[0.07] text-left">
                {["Material", "Fornecedor", "Saldo", "Mínimo", "Bobinas", "Custo médio", "Valor"].map((h) => (
                  <th key={h} className="rotulo px-3 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materiais.map((m) => {
                const s = saldo[m.id];
                const baixo = (s?.m2 ?? 0) < m.estoqueMinimoM2;
                return (
                  <tr key={m.id} className="border-b border-linha/[0.05] last:border-0">
                    <td className="px-3 py-3">
                      <span className="font-medium text-tx">{m.nome}</span>
                      <span className="block text-xs text-tx4">{nomeCategoria(m.categoria)}</span>
                    </td>
                    <td className="px-3 py-3 text-tx3">{fornecedores.find((f) => f.id === m.fornecedorId)?.nome ?? "–"}</td>
                    <td className={cn("num px-3 py-3 font-mono", baixo ? "text-alerta" : "text-tx")}>{fmtM2(s?.m2 ?? 0)}</td>
                    <td className="num px-3 py-3 font-mono text-tx4">{fmtM2(m.estoqueMinimoM2)}</td>
                    <td className="num px-3 py-3 font-mono text-tx3">{s?.bobinas ?? 0}</td>
                    <td className="num px-3 py-3 font-mono text-tx2">{s ? `${brl(s.custoMedioM2)}/m²` : "–"}</td>
                    <td className="num px-3 py-3 font-mono text-tx2">{brl(s?.valor ?? 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Cartao>
    </div>
  );
}

/* ---------------- DAR BAIXA ---------------- */
function AbaBaixa() {
  const { materiais, bobinas, darBaixa } = useEstoque();
  const ativas = bobinas
    .filter((b) => b.status !== "FINALIZADA")
    .sort((a, b) => Number(!!b.origemBobinaId) - Number(!!a.origemBobinaId) || a.comprimentoRestanteM - b.comprimentoRestanteM);
  const [bobinaId, setBobinaId] = useState(
    // começa pela bobina inteira com mais saldo; retalhos ficam no topo da lista para serem lembrados
    [...ativas].filter((b) => !b.origemBobinaId).sort((a, b) => b.comprimentoRestanteM - a.comprimentoRestanteM)[0]?.id ?? ativas[0]?.id ?? "",
  );
  const [ref, setRef] = useState("");
  const [area, setArea] = useState(5);
  const [corte, setCorte] = useState(0);
  const [retalho, setRetalho] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);

  const b = bobinas.find((x) => x.id === bobinaId);
  const mat = materiais.find((m) => m.id === b?.materialId);
  const perdaPct = perdaPadrao(mat?.categoria);
  const sugestao = b ? sugerirCorte(area, b.larguraM, perdaPct) : 0;
  const m2Cortado = b ? m2(b.larguraM, corte) : 0;
  const m2Ret = b ? m2(b.larguraM, retalho) : 0;
  const perda = Math.max(0, Math.round((m2Cortado - m2Ret - area) * 1000) / 1000);
  const custo = b ? (m2Cortado - m2Ret) * custoM2Bobina(b) : 0;
  const excede = !!b && corte > b.comprimentoRestanteM + 1e-9;
  const retalhoNaBobina = mat && b ? ativas.filter((x) => x.materialId === mat.id && x.origemBobinaId && x.id !== b.id) : [];

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = darBaixa(bobinaId, { areaAplicadaM2: area, comprimentoCortadoM: corte, retalhoM: retalho || undefined, referencia: ref.trim() || undefined });
      setMsg({ ok: true, texto: `Baixa registrada: ${fmtM2(r.movimento.m2Cortado)} cortados, ${fmtM2(r.movimento.m2Perda)} de perda (${r.perdaPct}%), custo do material ${brl(r.movimento.custo)}. Restam ${fmtM(r.bobina.comprimentoRestanteM)} na ${r.bobina.codigo}.${r.retalho ? ` Retalho ${r.retalho.codigo} guardado.` : ""}` });
      setCorte(0);
      setRetalho(0);
      setRef("");
    } catch (err) {
      setMsg({ ok: false, texto: (err as Error).message });
    }
  };

  return (
    <form onSubmit={enviar} className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Cartao className="flex flex-col gap-5">
        <h3 className="font-semibold text-tx">Baixa por serviço</h3>
        <Campo rotulo="Bobina usada" htmlFor="bx-bobina" dica="Retalhos aparecem primeiro: use a sobra antes de abrir bobina nova.">
          <select id="bx-bobina" className="campo" value={bobinaId} onChange={(e) => setBobinaId(e.target.value)}>
            {ativas.map((x) => (
              <option key={x.id} value={x.id}>
                {rotuloBobina(x, materiais)}
              </option>
            ))}
          </select>
        </Campo>
        {retalhoNaBobina.length > 0 && !b?.origemBobinaId && (
          <p className="flex items-center gap-2 rounded-xl border border-esmeralda/30 bg-esmeralda/10 px-3 py-2 text-sm text-esmeralda-soft">
            <RotateCcw className="h-4 w-4 shrink-0" aria-hidden /> Existe retalho deste material ({retalhoNaBobina.map((x) => `${x.codigo}, ${fmtM(x.comprimentoRestanteM)}`).join("; ")}). Se o serviço couber nele, use-o primeiro.
          </p>
        )}
        <Texto id="bx-ref" rotulo="Ordem de serviço / cliente" valor={ref} onChange={setRef} placeholder="Ex.: OS-1030 · Vitrine loja Méier" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Numero id="bx-area" rotulo="Área aplicada" sufixo="m²" valor={area} onChange={setArea} dica="Soma dos vidros/peças cobertos" />
          <Numero id="bx-corte" rotulo="Cortado da bobina" sufixo="m" valor={corte} onChange={setCorte} dica={b ? `Largura ${fmtM(b.larguraM)}` : undefined} />
          <Numero id="bx-retalho" rotulo="Sobrou inteiro (retalho)" sufixo="m" valor={retalho} onChange={setRetalho} dica={mat ? `Guarde se ≥ ${fmtM(mat.retalhoMinimoM)}` : undefined} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" tamanho="sm" variante="contorno" onClick={() => setCorte(sugestao)} disabled={!b}>
            <Wand2 className="h-4 w-4" aria-hidden /> Sugerir corte ({fmtM(sugestao)}<span className="hidden sm:inline"> com {perdaPct}% de perda</span>)
          </Button>
          <Button type="submit" tamanho="sm" disabled={!b || corte <= 0}>
            <ArrowDownToLine className="h-4 w-4" aria-hidden /> Registrar baixa
          </Button>
        </div>
        {msg && (
          <p role="status" className={cn("flex items-start gap-2 rounded-xl border px-3 py-2 text-sm", msg.ok ? "border-esmeralda/30 bg-esmeralda/10 text-esmeralda-soft" : "border-perigo/30 bg-perigo/10 text-perigo")}>
            {msg.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
            {msg.texto}
          </p>
        )}
      </Cartao>

      <Cartao forte className="flex flex-col gap-4">
        <h3 className="flex items-center gap-2 font-semibold text-tx">
          <Ruler className="h-4 w-4 text-neon" aria-hidden /> Como fica o corte
        </h3>
        {b ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-tx4">
                <span>{b.codigo}</span>
                <span className="num font-mono">{fmtM(b.comprimentoRestanteM)} de {fmtM(b.comprimentoInicialM)}</span>
              </div>
              {/* barra da bobina: o que fica, o que sai no corte */}
              <div className="flex h-3 overflow-hidden rounded-full bg-linha/[0.06]" aria-hidden>
                <div className="bg-zinc-500/60" style={{ width: `${Math.max(0, ((b.comprimentoRestanteM - corte) / b.comprimentoInicialM) * 100)}%` }} />
                <div className="bg-neon" style={{ width: `${Math.min(100, (Math.min(corte, b.comprimentoRestanteM) / b.comprimentoInicialM) * 100)}%` }} />
              </div>
            </div>
            <dl className="flex flex-col gap-2.5 text-sm">
              {[
                ["Cortado", fmtM2(m2Cortado)],
                ["Aplicado", fmtM2(area)],
                ["Volta como retalho", fmtM2(m2Ret)],
                ["Perda", `${fmtM2(perda)}${m2Cortado > 0 ? ` (${Math.round((perda / m2Cortado) * 100)}%)` : ""}`],
                ["Custo do material", brl(custo)],
                ["Fica na bobina", excede ? `faltam ${fmtM(corte - b.comprimentoRestanteM)}` : fmtM(b.comprimentoRestanteM - corte)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-linha/[0.05] pb-2 last:border-0">
                  <dt className="text-tx3">{k}</dt>
                  <dd className="num font-mono font-semibold text-tx">{v}</dd>
                </div>
              ))}
            </dl>
            {excede && (
              <p className="flex items-start gap-2 rounded-2xl border border-alerta/30 bg-alerta/[0.06] p-3 text-xs text-alerta">
                <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden />
                Essa bobina só tem {fmtM(b.comprimentoRestanteM)}. Escolha outra bobina do mesmo material ou corte em duas baixas.
              </p>
            )}
            <p className="text-xs text-tx4">
              A bobina tem largura fixa de {fmtM(b.larguraM)}, então cada metro cortado vale {fmtM2(b.larguraM)}. A diferença entre o cortado e o aplicado é a perda do serviço.
            </p>
          </>
        ) : (
          <p className="text-sm text-tx4">Cadastre uma bobina na aba Entrada.</p>
        )}
      </Cartao>
    </form>
  );
}

/* ---------------- BOBINAS ---------------- */
function AbaBobinas() {
  const { materiais, bobinas, fornecedores, ajustar } = useEstoque();
  const [filtro, setFiltro] = useState("todos");
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
  const [contagem, setContagem] = useState<Record<string, number>>({});
  const lista = bobinas.filter((b) => (filtro === "todos" || b.materialId === filtro) && (mostrarFinalizadas || b.status !== "FINALIZADA"));
  return (
    <Cartao className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Campo rotulo="Material" htmlFor="bb-filtro" className="min-w-[240px]">
          <select id="bb-filtro" className="campo" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            {materiais.map((m) => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </Campo>
        <label className="flex items-center gap-2 pb-3 text-sm text-tx3">
          <input type="checkbox" checked={mostrarFinalizadas} onChange={(e) => setMostrarFinalizadas(e.target.checked)} /> Mostrar finalizadas
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {lista.map((b) => {
          const m = materiais.find((x) => x.id === b.materialId);
          const pct = pctRestante(b);
          return (
            <div key={b.id} className="flex flex-col gap-3 rounded-2xl border border-linha/[0.08] bg-zinc-950/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <span className="num font-mono text-xs text-tx4">{b.codigo}</span>
                  <span className="font-medium leading-tight text-tx">{m?.nome}</span>
                  <span className="text-xs text-tx4">{fornecedores.find((f) => f.id === b.fornecedorId)?.nome}{b.notaFiscal ? ` · ${b.notaFiscal}` : ""}</span>
                </div>
                <Selo tom={b.status === "FINALIZADA" ? "neutro" : b.origemBobinaId ? "esmeralda" : pct <= 10 ? "alerta" : b.status === "LACRADA" ? "neon" : "neutro"}>
                  {b.origemBobinaId ? "Retalho" : b.status === "LACRADA" ? "Lacrada" : b.status === "FINALIZADA" ? "Acabou" : `${pct}%`}
                </Selo>
              </div>
              <BarraProgresso valor={pct} tom={pct <= 10 ? "alerta" : "neon"} />
              <div className="num flex justify-between font-mono text-xs text-tx3">
                <span>{fmtM(b.comprimentoRestanteM)} × {fmtM(b.larguraM)}</span>
                <span className="text-tx">{fmtM2(m2Restante(b))}</span>
              </div>
              <div className="num flex justify-between font-mono text-xs text-tx4">
                <span>{brl(custoM2Bobina(b))}/m²</span>
                <span>entrada {b.dataEntrada.split("-").reverse().join("/")}</span>
              </div>
              {b.status !== "FINALIZADA" && (
                <div className="flex items-end gap-2">
                  <Numero id={`aj-${b.id}`} rotulo="Contagem física" sufixo="m" valor={contagem[b.id] ?? b.comprimentoRestanteM} onChange={(n) => setContagem({ ...contagem, [b.id]: n })} />
                  <Button
                    tamanho="sm"
                    variante="fantasma"
                    disabled={contagem[b.id] === undefined || contagem[b.id] === b.comprimentoRestanteM}
                    onClick={() => ajustar(b.id, contagem[b.id], "Contagem física da bobina")}
                  >
                    Ajustar
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {lista.length === 0 && <p className="text-sm text-tx4">Nenhuma bobina com esse filtro.</p>}
    </Cartao>
  );
}

/* ---------------- ENTRADA ---------------- */
function AbaEntrada() {
  const { materiais, fornecedores, darEntrada } = useEstoque();
  const [materialId, setMaterialId] = useState(materiais[0]?.id ?? "");
  const mat = materiais.find((m) => m.id === materialId);
  const [fornecedorId, setFornecedorId] = useState(mat?.fornecedorId ?? fornecedores[0]?.id ?? "");
  const [largura, setLargura] = useState(mat?.larguraM ?? 1.52);
  const [comprimento, setComprimento] = useState(30);
  const [custo, setCusto] = useState(0);
  const [nf, setNf] = useState("");
  const [qtd, setQtd] = useState(1);
  const [ok, setOk] = useState("");
  const area = m2(largura, comprimento);

  const trocarMaterial = (id: string) => {
    setMaterialId(id);
    const m = materiais.find((x) => x.id === id);
    if (m) {
      setFornecedorId(m.fornecedorId);
      setLargura(m.larguraM);
    }
  };

  return (
    <form
      className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      onSubmit={(e) => {
        e.preventDefault();
        const novas = darEntrada({ materialId, fornecedorId, larguraM: largura, comprimentoM: comprimento, custoTotal: custo, notaFiscal: nf.trim() || undefined, quantidade: qtd });
        setOk(`${novas.length} bobina(s) cadastrada(s): ${novas.map((b) => b.codigo).join(", ")}. Escreva o código na etiqueta da bobina.`);
      }}
    >
      <Cartao className="flex flex-col gap-5">
        <h3 className="font-semibold text-tx">Entrada de bobina (compra)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Material" htmlFor="en-mat">
            <select id="en-mat" className="campo" value={materialId} onChange={(e) => trocarMaterial(e.target.value)}>
              {materiais.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Fornecedor" htmlFor="en-forn">
            <select id="en-forn" className="campo" value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)}>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </Campo>
          <Numero id="en-larg" rotulo="Largura" sufixo="m" passo={0.01} valor={largura} onChange={setLargura} dica="Película e vinil: normalmente 1,52 m" />
          <Numero id="en-comp" rotulo="Comprimento" sufixo="m" passo={0.01} valor={comprimento} onChange={setComprimento} dica="30 m na película; 22,86 ou 25 m no vinil" />
          <Numero id="en-custo" rotulo="Valor pago por bobina" prefixo="R$" passo={0.01} valor={custo} onChange={setCusto} dica="Com frete, para o custo real" />
          <Numero id="en-qtd" rotulo="Quantidade de bobinas" passo={1} valor={qtd} onChange={(n) => setQtd(Math.max(1, Math.round(n)))} />
          <Texto id="en-nf" rotulo="Nota fiscal" valor={nf} onChange={setNf} placeholder="Número da NF" />
        </div>
        <Button type="submit" className="w-fit" disabled={!materialId || custo <= 0 || comprimento <= 0}>
          <PackagePlus className="h-4 w-4" aria-hidden /> Dar entrada
        </Button>
        {ok && <p role="status" className="rounded-xl border border-esmeralda/30 bg-esmeralda/10 px-3 py-2 text-sm text-esmeralda-soft">{ok}</p>}
      </Cartao>
      <Cartao forte className="flex flex-col gap-3">
        <h3 className="font-semibold text-tx">Resumo da compra</h3>
        <dl className="flex flex-col gap-2.5 text-sm">
          {[
            ["Área por bobina", fmtM2(area)],
            ["Custo por m²", area > 0 ? `${brl(custo / area)}/m²` : "–"],
            ["Total da compra", brl(custo * qtd)],
            ["Área total", fmtM2(Math.round(area * qtd * 100) / 100)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-linha/[0.05] pb-2 last:border-0">
              <dt className="text-tx3">{k}</dt>
              <dd className="num font-mono font-semibold text-tx">{v}</dd>
            </div>
          ))}
        </dl>
      </Cartao>
    </form>
  );
}

/* ---------------- FORNECEDORES ---------------- */
const FORNECEDOR_VAZIO: Fornecedor = { id: "", nome: "", marcas: "", prazoEntregaDias: 5 };

function AbaFornecedores() {
  const { fornecedores, materiais, salvarFornecedor, novoId } = useEstoque();
  const [f, setF] = useState<Fornecedor>(FORNECEDOR_VAZIO);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {fornecedores.map((x) => (
          <Cartao key={x.id} className="flex flex-col gap-2 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-tx">{x.nome}</span>
              <Selo>{x.prazoEntregaDias} dias</Selo>
            </div>
            <span className="text-sm text-tx3">{x.marcas}</span>
            <span className="num font-mono text-xs text-tx4">{[x.telefone, x.email, x.site].filter(Boolean).join(" · ")}</span>
            <span className="text-xs text-tx4">{materiais.filter((m) => m.fornecedorId === x.id).length} materiais cadastrados</span>
            {x.observacoes && <span className="text-xs text-tx3">{x.observacoes}</span>}
            <Button tamanho="sm" variante="fantasma" className="w-fit" onClick={() => setF(x)}>Editar</Button>
          </Cartao>
        ))}
      </div>
      <Cartao forte className="flex flex-col gap-4 self-start">
        <h3 className="font-semibold text-tx">{f.id ? "Editar fornecedor" : "Novo fornecedor"}</h3>
        <Texto id="fo-nome" rotulo="Nome" valor={f.nome} onChange={(v) => setF({ ...f, nome: v })} />
        <Texto id="fo-cnpj" rotulo="CNPJ" valor={f.cnpj ?? ""} onChange={(v) => setF({ ...f, cnpj: v })} />
        <Texto id="fo-marcas" rotulo="Marcas / linhas" valor={f.marcas} onChange={(v) => setF({ ...f, marcas: v })} />
        <Texto id="fo-tel" rotulo="Telefone" valor={f.telefone ?? ""} onChange={(v) => setF({ ...f, telefone: v })} />
        <Texto id="fo-email" rotulo="E-mail" valor={f.email ?? ""} onChange={(v) => setF({ ...f, email: v })} />
        <Numero id="fo-prazo" rotulo="Prazo de entrega" sufixo="dias" passo={1} valor={f.prazoEntregaDias} onChange={(n) => setF({ ...f, prazoEntregaDias: n })} />
        <Texto id="fo-obs" rotulo="Observações" valor={f.observacoes ?? ""} onChange={(v) => setF({ ...f, observacoes: v })} />
        <div className="flex gap-2">
          <Button
            tamanho="sm"
            disabled={!f.nome.trim()}
            onClick={() => {
              salvarFornecedor({ ...f, id: f.id || novoId(), nome: f.nome.trim() });
              setF(FORNECEDOR_VAZIO);
            }}
          >
            Salvar
          </Button>
          {f.id && (
            <Button tamanho="sm" variante="fantasma" onClick={() => setF(FORNECEDOR_VAZIO)}>Cancelar</Button>
          )}
        </div>
      </Cartao>
    </div>
  );
}

/* ---------------- MATERIAIS ---------------- */
function AbaMateriais() {
  const { materiais, fornecedores, salvarMaterial, novoId } = useEstoque();
  const vazio: Material = { id: "", nome: "", categoria: "antivandalismo", fornecedorId: fornecedores[0]?.id ?? "", larguraM: 1.52, estoqueMinimoM2: 20, retalhoMinimoM: 0.5 };
  const [m, setM] = useState<Material>(vazio);
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <Cartao className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-linha/[0.07] text-left">
              {["Material", "Categoria", "Fornecedor", "Largura", "Mínimo", "Retalho mín.", ""].map((h) => (
                <th key={h} className="rotulo px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materiais.map((x) => (
              <tr key={x.id} className="border-b border-linha/[0.05] last:border-0">
                <td className="px-3 py-3 font-medium text-tx">{x.nome}</td>
                <td className="px-3 py-3 text-tx3">{nomeCategoria(x.categoria)}</td>
                <td className="px-3 py-3 text-tx3">{fornecedores.find((f) => f.id === x.fornecedorId)?.nome}</td>
                <td className="num px-3 py-3 font-mono text-tx2">{fmtM(x.larguraM)}</td>
                <td className="num px-3 py-3 font-mono text-tx2">{fmtM2(x.estoqueMinimoM2)}</td>
                <td className="num px-3 py-3 font-mono text-tx2">{fmtM(x.retalhoMinimoM)}</td>
                <td className="px-3 py-3"><Button tamanho="sm" variante="fantasma" onClick={() => setM(x)}>Editar</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Cartao>
      <Cartao forte className="flex flex-col gap-4 self-start">
        <h3 className="font-semibold text-tx">{m.id ? "Editar material" : "Novo material"}</h3>
        <Texto id="ma-nome" rotulo="Nome" valor={m.nome} onChange={(v) => setM({ ...m, nome: v })} placeholder="Ex.: 3M Safety S70 incolor" />
        <Campo rotulo="Categoria" htmlFor="ma-cat">
          <select id="ma-cat" className="campo" value={m.categoria} onChange={(e) => setM({ ...m, categoria: e.target.value as CategoriaMaterial })}>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Fornecedor principal" htmlFor="ma-forn">
          <select id="ma-forn" className="campo" value={m.fornecedorId} onChange={(e) => setM({ ...m, fornecedorId: e.target.value })}>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </Campo>
        <div className="grid grid-cols-3 gap-3">
          <Numero id="ma-larg" rotulo="Largura" sufixo="m" passo={0.01} valor={m.larguraM} onChange={(n) => setM({ ...m, larguraM: n })} />
          <Numero id="ma-min" rotulo="Mínimo" sufixo="m²" passo={1} valor={m.estoqueMinimoM2} onChange={(n) => setM({ ...m, estoqueMinimoM2: n })} />
          <Numero id="ma-ret" rotulo="Retalho" sufixo="m" valor={m.retalhoMinimoM} onChange={(n) => setM({ ...m, retalhoMinimoM: n })} />
        </div>
        <div className="flex gap-2">
          <Button
            tamanho="sm"
            disabled={!m.nome.trim() || !m.fornecedorId}
            onClick={() => {
              salvarMaterial({ ...m, id: m.id || novoId(), nome: m.nome.trim() });
              setM(vazio);
            }}
          >
            Salvar
          </Button>
          {m.id && <Button tamanho="sm" variante="fantasma" onClick={() => setM(vazio)}>Cancelar</Button>}
        </div>
      </Cartao>
    </div>
  );
}

/* ---------------- MOVIMENTAÇÕES ---------------- */
function AbaMovimentos() {
  const { movimentos, materiais, bobinas } = useEstoque();
  const tom = { ENTRADA: "neon", CONSUMO: "neutro", RETALHO: "esmeralda", AJUSTE: "alerta" } as const;
  return (
    <Cartao className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-linha/[0.07] text-left">
            {["Data", "Tipo", "Bobina", "Material", "Metros", "Cortado", "Aplicado", "Perda", "Custo", "Referência"].map((h) => (
              <th key={h} className="rotulo px-3 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movimentos.map((m) => (
            <tr key={m.id} className="border-b border-linha/[0.05] last:border-0">
              <td className="num px-3 py-3 font-mono text-tx3">{m.data.split("-").reverse().join("/")}</td>
              <td className="px-3 py-3"><Selo tom={tom[m.tipo]}>{m.tipo}</Selo></td>
              <td className="num px-3 py-3 font-mono text-xs text-tx3">{bobinas.find((b) => b.id === m.bobinaId)?.codigo}</td>
              <td className="px-3 py-3 text-tx2">{materiais.find((x) => x.id === m.materialId)?.nome}</td>
              <td className={cn("num px-3 py-3 font-mono", m.comprimentoM < 0 ? "text-perigo" : "text-esmeralda-soft")}>{m.comprimentoM > 0 ? "+" : ""}{fmtM(m.comprimentoM)}</td>
              <td className="num px-3 py-3 font-mono text-tx2">{m.m2Cortado ? fmtM2(m.m2Cortado) : "–"}</td>
              <td className="num px-3 py-3 font-mono text-tx2">{m.m2Aplicado ? fmtM2(m.m2Aplicado) : "–"}</td>
              <td className="num px-3 py-3 font-mono text-tx2">{m.m2Perda ? fmtM2(m.m2Perda) : "–"}</td>
              <td className="num px-3 py-3 font-mono text-tx">{brl(m.custo)}</td>
              <td className="px-3 py-3 text-tx3">{m.referencia ?? m.observacao ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Cartao>
  );
}

/* ---------------- PRECIFICAÇÃO ---------------- */
function AbaPrecos() {
  const { config } = usePlataforma();
  const { materiais, bobinas } = useEstoque();
  const saldo = saldoPorMaterial(bobinas);
  const [p, setP] = useState({ maoDeObraM2: 50, impostosPct: 6, comissaoPct: config.taxas.plataformaPct, margemPct: 15, taxaCartaoPct: 9 });
  const linhas = useMemo(
    () =>
      materiais.map((m) => {
        const custo = saldo[m.id]?.custoMedioM2 ?? 0;
        return { m, custo, preco: precoSugeridoM2(custo, { ...p, perdaPct: perdaPadrao(m.categoria) }) };
      }),
    [materiais, saldo, p],
  );
  return (
    <div className="flex flex-col gap-5">
      <Cartao className="flex flex-col gap-4">
        <h3 className="font-semibold text-tx">Premissas</h3>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Numero id="pr-mo" rotulo="Mão de obra" prefixo="R$" sufixo="/m²" passo={1} valor={p.maoDeObraM2} onChange={(n) => setP({ ...p, maoDeObraM2: n })} />
          <Numero id="pr-imp" rotulo="Impostos" sufixo="%" passo={0.5} valor={p.impostosPct} onChange={(n) => setP({ ...p, impostosPct: n })} />
          <Numero id="pr-com" rotulo="Comissão plataforma" sufixo="%" passo={1} valor={p.comissaoPct} onChange={(n) => setP({ ...p, comissaoPct: n })} />
          <Numero id="pr-mar" rotulo="Margem" sufixo="%" passo={1} valor={p.margemPct} onChange={(n) => setP({ ...p, margemPct: n })} />
          <Numero id="pr-car" rotulo="Taxa do cartão 10x" sufixo="%" passo={0.5} valor={p.taxaCartaoPct} onChange={(n) => setP({ ...p, taxaCartaoPct: n })} />
        </div>
        <p className="text-xs text-tx4">
          Preço = (custo médio do material × (1 + perda da categoria) + mão de obra) ÷ (1 − impostos − comissão − margem). No cartão, a taxa também sai da conta. O custo médio vem das bobinas em estoque.
        </p>
      </Cartao>
      <Cartao className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-linha/[0.07] text-left">
              {["Material", "Custo médio", "Perda", "Custo direto", "Preço PIX", "Preço cartão"].map((h) => (
                <th key={h} className="rotulo px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ m, custo, preco }) => (
              <tr key={m.id} className="border-b border-linha/[0.05] last:border-0">
                <td className="px-3 py-3 font-medium text-tx">{m.nome}</td>
                <td className="num px-3 py-3 font-mono text-tx2">{custo ? `${brl(custo)}/m²` : "sem estoque"}</td>
                <td className="num px-3 py-3 font-mono text-tx3">{perdaPadrao(m.categoria)}%</td>
                <td className="num px-3 py-3 font-mono text-tx2">{custo ? `${brl(preco.custoDireto)}/m²` : "–"}</td>
                <td className="num px-3 py-3 font-mono font-semibold text-neon">{custo ? `${brl(preco.pix)}/m²` : "–"}</td>
                <td className="num px-3 py-3 font-mono text-tx">{custo ? `${brl(preco.cartao)}/m²` : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Cartao>
    </div>
  );
}

export function PainelEstoque() {
  return (
    <EstoqueProvider>
      <PainelEstoqueInterno />
    </EstoqueProvider>
  );
}

function PainelEstoqueInterno() {
  const { restaurarExemplo } = useEstoque();
  const [aba, setAba] = useState<string>("painel");
  return (
    <Tabs.Root value={aba} onValueChange={setAba} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 sem-barra sm:mx-0 sm:w-auto sm:max-w-full sm:px-0">
          <Tabs.List className="inline-flex min-w-max gap-1 rounded-3xl border border-linha/[0.08] bg-linha/[0.03] p-1.5" aria-label="Seções do estoque">
            {ABAS.map((a) => (
              <Tabs.Trigger
                key={a.id}
                value={a.id}
                className="rounded-2xl px-3.5 py-2 text-sm font-medium text-tx3 transition-[background-color,color] duration-150 hover:text-tx data-[state=active]:bg-neon/[0.12] data-[state=active]:text-neon"
              >
                {a.rotulo}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
        <Button tamanho="sm" variante="fantasma" onClick={restaurarExemplo}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Restaurar exemplo
        </Button>
      </div>
      <Tabs.Content value="painel"><AbaPainel irPara={setAba} /></Tabs.Content>
      <Tabs.Content value="baixa"><AbaBaixa /></Tabs.Content>
      <Tabs.Content value="bobinas"><AbaBobinas /></Tabs.Content>
      <Tabs.Content value="entrada"><AbaEntrada /></Tabs.Content>
      <Tabs.Content value="fornecedores"><AbaFornecedores /></Tabs.Content>
      <Tabs.Content value="materiais"><AbaMateriais /></Tabs.Content>
      <Tabs.Content value="movimentos"><AbaMovimentos /></Tabs.Content>
      <Tabs.Content value="precos"><AbaPrecos /></Tabs.Content>
    </Tabs.Root>
  );
}
