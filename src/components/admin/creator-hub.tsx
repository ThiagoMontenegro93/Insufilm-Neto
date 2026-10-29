"use client";

/**
 * Creator Hub (SUPER_ADMIN): 9 abas que editam a configuração da plataforma.
 * Cada aba trabalha num rascunho e só grava ao clicar em "Salvar", gerando um log de auditoria.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AlertTriangle, ExternalLink, KeyRound, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campo, Cartao, Interruptor, Selo } from "@/components/ui/primitivos";
import { usePlataforma } from "@/lib/store";
import type { PlatformConfig, PorteVeiculo } from "@/lib/config";
import { brl, calcularSplit, precoEnvelopamento, precoLinhas } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { PainelProspeccao } from "./prospeccao";
import { PainelEstoque } from "./estoque";
import { AbaCustos } from "./custos";
import { ListaAuditoria } from "./auditoria";

const ABAS = [
  { id: "geral", rotulo: "Geral", icone: "⚙️" },
  { id: "servicos", rotulo: "Serviços", icone: "🎨" },
  { id: "custos", rotulo: "Custos", icone: "🧮" },
  { id: "financeiro", rotulo: "Financeiro", icone: "💰" },
  { id: "apis", rotulo: "APIs", icone: "🔌" },
  { id: "nichos", rotulo: "Nichos", icone: "🎯" },
  { id: "prospeccao", rotulo: "Prospecção", icone: "📡" },
  { id: "estoque", rotulo: "Estoque", icone: "🧻" },
  { id: "site", rotulo: "Site", icone: "🏠" },
  { id: "modulos", rotulo: "Módulos", icone: "🚀" },
  { id: "auditoria", rotulo: "Auditoria", icone: "📋" },
] as const;

/** Rascunho local de um ramo da config, com salvar/descartar. */
function useRascunho<K extends keyof PlatformConfig>(chave: K) {
  const { config, alterar } = usePlataforma();
  const [rascunho, setRascunho] = useState<PlatformConfig[K]>(config[chave]);
  useEffect(() => setRascunho(config[chave]), [config, chave]);
  const sujo = JSON.stringify(rascunho) !== JSON.stringify(config[chave]);
  const salvar = (descricao: string) =>
    alterar(descricao, (c) => {
      c[chave] = structuredClone(rascunho);
    });
  const descartar = () => setRascunho(config[chave]);
  return { rascunho, setRascunho, sujo, salvar, descartar, config };
}

function BarraSalvar({ sujo, onSalvar, onDescartar }: { sujo: boolean; onSalvar: () => void; onDescartar: () => void }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-3 transition-opacity duration-200", sujo ? "opacity-100" : "opacity-50")}>
      {sujo && <span className="mr-auto text-sm text-alerta">Alterações não salvas</span>}
      <Button variante="fantasma" tamanho="sm" disabled={!sujo} onClick={onDescartar}>
        Descartar
      </Button>
      <Button tamanho="sm" disabled={!sujo} onClick={onSalvar}>
        <Save className="h-4 w-4" aria-hidden /> Salvar e registrar
      </Button>
    </div>
  );
}

function NumeroCampo({ id, rotulo, valor, onChange, sufixo, prefixo, passo = 1, dica, bloqueado }: { id: string; rotulo: string; valor: number; onChange: (n: number) => void; sufixo?: string; prefixo?: string; passo?: number; dica?: string; bloqueado?: boolean }) {
  return (
    <Campo rotulo={rotulo} htmlFor={id} dica={dica}>
      <div className="relative">
        {prefixo && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-tx4">{prefixo}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={passo}
          value={Number.isFinite(valor) ? valor : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={bloqueado}
          className={cn("campo num font-mono disabled:cursor-not-allowed disabled:opacity-60", prefixo && "pl-11", sufixo && "pr-12")}
        />
        {sufixo && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-tx4">{sufixo}</span>}
      </div>
    </Campo>
  );
}

/* ---------------- GERAL ---------------- */
function AbaGeral() {
  const { rascunho: t, setRascunho, sujo, salvar, descartar, config } = useRascunho("taxas");
  const [simulado, setSimulado] = useState(1000);
  const s = calcularSplit(simulado, t, { descontoPct: t.descontoCupomPct });
  const locatarioPct = 100 - t.plataformaPct - t.indicadorPct;
  const invalido = locatarioPct < 0;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <Cartao className="flex flex-col gap-5">
        <h3 className="text-lg font-semibold text-tx">Taxas da plataforma</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumeroCampo id="tx-plat" rotulo="Sua taxa (dono)" sufixo="%" valor={t.plataformaPct} onChange={(n) => setRascunho({ ...t, plataformaPct: n })} dica={config.taxas.plataformaPct !== t.plataformaPct ? `Era ${config.taxas.plataformaPct}%` : "Era 20%, aumentou para 30%"} />
          <NumeroCampo id="tx-ind" rotulo="Comissão do indicador" sufixo="%" valor={t.indicadorPct} onChange={(n) => setRascunho({ ...t, indicadorPct: n })} dica="Fixa por serviço fechado" />
          <NumeroCampo id="tx-mens" rotulo="Mensalidade por filial" prefixo="R$" passo={0.01} valor={t.mensalidadeFilial} onChange={(n) => setRascunho({ ...t, mensalidadeFilial: n })} dica="Cobrança recorrente via Stripe" />
          <NumeroCampo id="tx-cupom" rotulo="Desconto do cupom de indicação" sufixo="%" valor={t.descontoCupomPct} onChange={(n) => setRascunho({ ...t, descontoCupomPct: n })} dica="0% = cliente indicado paga o preço cheio" />
        </div>
        {invalido && (
          <p className="flex items-center gap-2 text-sm text-perigo">
            <AlertTriangle className="h-4 w-4" /> A soma das taxas passa de 100%.
          </p>
        )}
        <BarraSalvar sujo={sujo && !invalido} onSalvar={() => salvar("Taxas da plataforma alteradas")} onDescartar={descartar} />
      </Cartao>

      <Cartao forte className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-tx">Simulação de split</h3>
          <Selo tom="neon">ao vivo</Selo>
        </div>
        <NumeroCampo id="sim-valor" rotulo="Valor do serviço" prefixo="R$" passo={10} valor={simulado} onChange={setSimulado} />
        <dl className="flex flex-col gap-3">
          {[
            { k: `Desconto cupom ${t.descontoCupomPct}%`, v: -s.desconto, c: "text-tx3", p: 0 },
            { k: `Você ${t.plataformaPct}%`, v: s.plataforma, c: "text-neon", p: t.plataformaPct },
            { k: `Indicador ${t.indicadorPct}%`, v: s.indicador, c: "text-esmeralda-soft", p: t.indicadorPct },
            { k: `Locatário ${Math.max(0, locatarioPct)}%`, v: s.locatario, c: "text-tx", p: Math.max(0, locatarioPct) },
          ].map((l) => (
            <div key={l.k} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <dt className="text-sm text-tx3">{l.k}</dt>
                <dd className={cn("num font-mono font-semibold", l.c)}>{brl(l.v)}</dd>
              </div>
              {l.p > 0 && (
                <div className="h-1 overflow-hidden rounded-full bg-linha/[0.06]">
                  <div className={cn("h-full rounded-full", l.c === "text-neon" ? "bg-neon" : l.c === "text-esmeralda-soft" ? "bg-esmeralda" : "bg-zinc-300")} style={{ width: `${l.p}%` }} />
                </div>
              )}
            </div>
          ))}
        </dl>
        <p className="text-xs text-tx4">
          Cada alteração salva gera <span className="font-mono text-tx2">CONFIG_PLATAFORMA_ALTERADA</span> com snapshot JSON em{" "}
          <Link className="text-neon underline-offset-4 hover:underline" href="/admin/auditoria">
            /admin/auditoria
          </Link>
          .
        </p>
      </Cartao>
    </div>
  );
}

/* ---------------- SERVIÇOS ---------------- */
function AbaServicos() {
  const { rascunho: s, setRascunho, sujo, salvar, descartar, config } = useRascunho("servicos");
  const prev = { ...config, servicos: s };
  const civic = precoEnvelopamento(prev, "3m-1080", "fosco", s.envelopamento.m2MedioTotal);
  const gel = precoLinhas(s.arquitetonico, [{ itemId: "geladeira", quantidade: 1 }]).total;
  const parede = precoLinhas(s.arquitetonico, [{ itemId: "parede", largura: 3, altura: 2, quantidade: 1 }]).total;
  const sp = (v: number) => calcularSplit(v, config.taxas);

  const editarLista = (grupo: "peliculaSeguranca" | "arquitetonico", id: string, preco: number) =>
    setRascunho({ ...s, [grupo]: s[grupo].map((i) => (i.id === id ? { ...i, preco } : i)) });

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Cartao className="flex flex-col gap-4">
          <h3 className="font-semibold text-tx">Película de segurança</h3>
          {s.peliculaSeguranca.map((i) => (
            <NumeroCampo key={i.id} id={`pel-${i.id}`} rotulo={`${i.nome} · m²`} prefixo="R$" valor={i.preco} bloqueado={i.custo?.automatico} dica={i.custo?.automatico ? "Calculado pelo custo · aba Custos" : undefined} onChange={(n) => editarLista("peliculaSeguranca", i.id, n)} />
          ))}
        </Cartao>
        <Cartao className="flex flex-col gap-4">
          <h3 className="font-semibold text-tx">Envelopamento automotivo</h3>
          {s.envelopamento.marcas.map((m) => (
            <NumeroCampo
              key={m.id}
              id={`env-${m.id}`}
              rotulo={`${m.nome} · m²`}
              prefixo="R$"
              valor={m.preco}
              bloqueado={m.custo?.automatico}
              dica={m.custo?.automatico ? "Calculado pelo custo · aba Custos" : undefined}
              onChange={(n) => setRascunho({ ...s, envelopamento: { ...s.envelopamento, marcas: s.envelopamento.marcas.map((x) => (x.id === m.id ? { ...x, preco: n } : x)) } })}
            />
          ))}
          <div className="grid grid-cols-2 gap-3">
            {s.envelopamento.acabamentos
              .filter((a) => a.id !== "brilho")
              .map((a) => (
                <NumeroCampo
                  key={a.id}
                  id={`acab-${a.id}`}
                  rotulo={`${a.nome} +m²`}
                  prefixo="R$"
                  valor={a.adicionalM2}
                  onChange={(n) => setRascunho({ ...s, envelopamento: { ...s.envelopamento, acabamentos: s.envelopamento.acabamentos.map((x) => (x.id === a.id ? { ...x, adicionalM2: n } : x)) } })}
                />
              ))}
          </div>
          <NumeroCampo id="env-media" rotulo="Total médio de um carro" sufixo="m²" valor={s.envelopamento.m2MedioTotal} onChange={(n) => setRascunho({ ...s, envelopamento: { ...s.envelopamento, m2MedioTotal: n } })} />
        </Cartao>
        <Cartao className="flex flex-col gap-4">
          <h3 className="font-semibold text-tx">Arquitetônico</h3>
          {s.arquitetonico.map((i) => (
            <NumeroCampo key={i.id} id={`arq-${i.id}`} rotulo={`${i.nome} · ${i.unidade === "m2" ? "m²" : "fixo"}`} prefixo="R$" valor={i.preco} bloqueado={i.custo?.automatico} dica={i.custo?.automatico ? "Calculado pelo custo · aba Custos" : undefined} onChange={(n) => editarLista("arquitetonico", i.id, n)} />
          ))}
        </Cartao>
      </div>

      <Cartao className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-tx">Antivandalismo · produto principal</h3>
          <span className="text-xs text-tx4">Preço à vista em 0 mostra &quot;sob consulta&quot; no site</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {s.antivandalismo.map((l) => {
            const editar = (campo: "precoVista" | "precoCartao" | "parcelas", n: number) =>
              setRascunho({ ...s, antivandalismo: s.antivandalismo.map((x) => (x.id === l.id ? { ...x, [campo]: n } : x)) });
            const un = l.unidade === "m2" ? "m²" : "carro";
            return (
              <div key={l.id} className="flex flex-col gap-3 rounded-2xl border border-linha/[0.08] p-4">
                <span className="text-sm font-medium text-tx">{l.nome}</span>
                <NumeroCampo id={`av-${l.id}-vista`} rotulo={`À vista (PIX) · ${un}`} prefixo="R$" valor={l.precoVista} bloqueado={l.custo?.automatico} dica={l.custo?.automatico ? "Calculado pelo custo · aba Custos" : undefined} onChange={(n) => editar("precoVista", n)} />
                <NumeroCampo id={`av-${l.id}-cartao`} rotulo={`No cartão · ${un}`} prefixo="R$" valor={l.precoCartao} bloqueado={l.custo?.automatico} onChange={(n) => editar("precoCartao", n)} />
                <NumeroCampo id={`av-${l.id}-parc`} rotulo="Parcelas no cartão" sufixo="x" valor={l.parcelas} onChange={(n) => editar("parcelas", n)} />
              </div>
            );
          })}
        </div>
      </Cartao>

      <TabelaPortes portes={s.portes} onChange={(portes) => setRascunho({ ...s, portes })} />

      <Cartao forte className="flex flex-col gap-4">
        <h3 className="font-semibold text-tx">Exemplos com os preços acima</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { t: `Civic total fosco 3M`, conta: `${civic.areaM2} m² × ${brl(civic.valorM2)}`, v: civic.total, st: "ORCAMENTO" },
            { t: "Geladeira madeira 4,5 m²", conta: "valor fixo", v: gel, st: "ORCAMENTO" },
            { t: "Parede 3 × 2 m", conta: `6 m² × ${brl(s.arquitetonico.find((a) => a.id === "parede")!.preco)}`, v: parede, st: "ORCAMENTO" },
          ].map((e) => (
            <div key={e.t} className="flex flex-col gap-2 rounded-2xl border border-linha/[0.08] bg-zinc-950/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-tx">{e.t}</span>
                <Selo tom="alerta">{e.st}</Selo>
              </div>
              <span className="num font-mono text-xs text-tx4">{e.conta}</span>
              <span className="num text-2xl font-bold text-tx">{brl(e.v)}</span>
              <span className="num font-mono text-xs text-tx3">
                Você <span className="text-neon">{brl(sp(e.v).plataforma)}</span> · Indicador <span className="text-esmeralda-soft">{brl(sp(e.v).indicador)}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-tx4">Esses preços alimentam /pelicula, /envelopamento e /arquitetonico assim que você salva. Os campos travados são calculados pelo custo do fornecedor na aba Custos.</p>
      </Cartao>
      <BarraSalvar sujo={sujo} onSalvar={() => salvar("Tabela de preços de serviços alterada")} onDescartar={descartar} />
    </div>
  );
}

/**
 * Preço pelo porte do veículo: o profissional define pela experiência quanto cobra
 * de um compacto, de um SUV ou de um caminhão. 0 = sob consulta no site.
 */
function TabelaPortes({ portes, onChange }: { portes: PorteVeiculo[]; onChange: (p: PorteVeiculo[]) => void }) {
  const editar = <K extends keyof PorteVeiculo>(id: string, campo: K, valor: PorteVeiculo[K]) =>
    onChange(portes.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
  const adicionar = () =>
    onChange([...portes, { id: `porte-${Date.now().toString(36)}`, nome: "Novo porte", exemplos: "", m2Envelopamento: 0, precoInsulfilm: 0, precoAntivandalismo: 0 }]);
  const remover = (id: string) => onChange(portes.filter((p) => p.id !== id));
  const numero = (id: string, campo: "m2Envelopamento" | "precoInsulfilm" | "precoAntivandalismo", valor: number, rotulo: string, prefixo?: string, sufixo?: string) => (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] text-tx4 lg:sr-only">{rotulo}</span>
      <span className="relative">
        {prefixo && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-tx4">{prefixo}</span>}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={campo === "m2Envelopamento" ? 0.5 : 5}
          value={valor}
          onChange={(e) => editar(id, campo, Math.max(0, Number(e.target.value) || 0))}
          aria-label={rotulo}
          className={cn("campo num w-full font-mono", prefixo && "pl-9", sufixo && "pr-9")}
        />
        {sufixo && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-tx4">{sufixo}</span>}
      </span>
    </label>
  );
  const colunas = "lg:grid-cols-[1fr_1.3fr_110px_130px_130px_40px]";
  return (
    <Cartao className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-tx">Preço por porte de veículo</h3>
          <p className="text-xs text-tx4">Valor fechado que você cobra por tamanho de carro. Em 0, o site mostra &quot;sob consulta&quot;.</p>
        </div>
        <Button variante="contorno" tamanho="sm" onClick={adicionar}>
          <Plus className="h-4 w-4" aria-hidden /> Adicionar porte
        </Button>
      </div>
      <div className={cn("hidden gap-3 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-tx4 lg:grid", colunas)}>
        <span>Porte</span>
        <span>Exemplos de modelo</span>
        <span>Envelopar</span>
        <span>Insulfilm</span>
        <span>Antivandalismo</span>
        <span className="sr-only">Remover</span>
      </div>
      <ul className="flex flex-col gap-3">
        {portes.map((p) => (
          <li key={p.id} className={cn("grid grid-cols-2 items-end gap-3 rounded-2xl border border-linha/[0.08] p-3 lg:rounded-none lg:border-0 lg:p-0", colunas)}>
            <label className="col-span-2 flex min-w-0 flex-col gap-1 sm:col-span-1">
              <span className="text-[11px] text-tx4 lg:sr-only">Porte</span>
              <input className="campo w-full" value={p.nome} onChange={(e) => editar(p.id, "nome", e.target.value)} aria-label="Nome do porte" />
            </label>
            <label className="col-span-2 flex min-w-0 flex-col gap-1 sm:col-span-1">
              <span className="text-[11px] text-tx4 lg:sr-only">Exemplos de modelo</span>
              <input className="campo w-full" value={p.exemplos} placeholder="Mobi, HB20, Onix" onChange={(e) => editar(p.id, "exemplos", e.target.value)} aria-label="Exemplos de modelo" />
            </label>
            {numero(p.id, "m2Envelopamento", p.m2Envelopamento, "Envelopar (m²)", undefined, "m²")}
            {numero(p.id, "precoInsulfilm", p.precoInsulfilm, "Insulfilm (R$)", "R$")}
            {numero(p.id, "precoAntivandalismo", p.precoAntivandalismo, "Antivandalismo (R$)", "R$")}
            <button
              type="button"
              onClick={() => remover(p.id)}
              disabled={portes.length <= 1}
              aria-label={`Remover ${p.nome}`}
              className="grid h-11 w-11 place-items-center justify-self-end rounded-xl text-tx4 transition-colors duration-150 hover:bg-perigo/10 hover:text-perigo disabled:opacity-30"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-tx4">
        Envelopar: área média do porte, multiplicada pelo valor da marca e do acabamento em /envelopamento. Insulfilm aparece em /pelicula. Antivandalismo, quando preenchido, substitui o
        &quot;sob consulta&quot; do card de carros.
      </p>
    </Cartao>
  );
}

/* ---------------- FINANCEIRO ---------------- */
function AbaFinanceiro() {
  const { rascunho: f, setRascunho, sujo, salvar, descartar } = useRascunho("financeiro");
  return (
    <Cartao className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumeroCampo id="fin-min" rotulo="Saque mínimo PIX" prefixo="R$" valor={f.saqueMinimo} onChange={(n) => setRascunho({ ...f, saqueMinimo: n })} />
        <NumeroCampo id="fin-idade" rotulo="Idade mínima" sufixo="anos" valor={f.idadeMinima} onChange={(n) => setRascunho({ ...f, idadeMinima: n })} />
        <NumeroCampo id="fin-auto" rotulo="Aprovação automática até" prefixo="R$" valor={f.autoAprovacaoAte} onChange={(n) => setRascunho({ ...f, autoAprovacaoAte: n })} dica="Acima disso, aprovação manual" />
      </div>
      <div className="flex flex-col divide-y divide-white/[0.06] rounded-2xl border border-linha/[0.08]">
        {[
          { id: "fin-dupla", k: "duplaConfirmacaoPix" as const, t: "Dupla confirmação PIX", d: "O parceiro revisa valor e chave e confirma de novo antes de enviar." },
          { id: "fin-kyc", k: "kycObrigatorio" as const, t: "KYC selfie + CPF antes do primeiro saque", d: "Documento e selfie ficam em bucket privado, com acesso auditado." },
        ].map((o) => (
          <div key={o.k} className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-medium text-tx">{o.t}</span>
              <span className="text-sm text-tx4">{o.d}</span>
            </div>
            <div className="flex items-center gap-3">
              <Selo tom={f[o.k] ? "esmeralda" : "neutro"}>{f[o.k] ? "ATIVO" : "INATIVO"}</Selo>
              <Interruptor id={o.id} rotulo={o.t} ligado={f[o.k]} onChange={(v) => setRascunho({ ...f, [o.k]: v })} />
            </div>
          </div>
        ))}
      </div>
      <BarraSalvar sujo={sujo} onSalvar={() => salvar("Regras financeiras alteradas")} onDescartar={descartar} />
    </Cartao>
  );
}

/* ---------------- APIS ---------------- */
function AbaApis() {
  const { rascunho: apis, setRascunho, sujo, salvar, descartar } = useRascunho("apis");
  const [chaves, setChaves] = useState<Record<string, string>>({});
  const registrar = (id: string) => {
    const k = (chaves[id] ?? "").trim();
    if (k.length < 8) return;
    // Só a máscara fica no navegador. A chave real vai para a variável de ambiente do servidor.
    setRascunho(apis.map((a) => (a.id === id ? { ...a, status: "OK", chaveMascarada: `${k.slice(0, 4)}…${k.slice(-2)}` } : a)));
    setChaves((c) => ({ ...c, [id]: "" }));
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        {apis.map((a) => (
          <Cartao key={a.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-semibold text-tx">{a.nome}</span>
                <span className="text-sm text-tx4">{a.finalidade}</span>
              </div>
              <Selo tom={a.status === "OK" ? "esmeralda" : "alerta"}>{a.status === "OK" ? "OK" : "NÃO CONFIGURADO"}</Selo>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tx4">
              {a.envVar ? <span className="rounded-lg bg-linha/[0.05] px-2 py-1 text-tx2">{a.envVar}</span> : <span>sem chave (API pública)</span>}
              {a.chaveMascarada && a.envVar && <span>{a.chaveMascarada}</span>}
            </div>
            {a.envVar && (
              <div className="flex gap-2">
                <label className="sr-only" htmlFor={`api-${a.id}`}>
                  Chave {a.nome}
                </label>
                <input
                  id={`api-${a.id}`}
                  type="password"
                  autoComplete="off"
                  placeholder="API_KEY_AQUI"
                  className="campo font-mono text-sm"
                  value={chaves[a.id] ?? ""}
                  onChange={(e) => setChaves((c) => ({ ...c, [a.id]: e.target.value }))}
                />
                <Button variante="vidro" onClick={() => registrar(a.id)} aria-label={`Registrar chave de ${a.nome}`}>
                  <KeyRound className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Cartao>
        ))}
      </div>
      <p className="text-xs text-tx4">Em produção, as chaves ficam em variáveis de ambiente (Vercel) ou criptografadas no banco. O painel nunca mostra a chave inteira.</p>
      <BarraSalvar sujo={sujo} onSalvar={() => salvar("Status de integrações alterado")} onDescartar={descartar} />
    </div>
  );
}

/* ---------------- NICHOS ---------------- */
function AbaNichos() {
  const { rascunho: n, setRascunho, sujo, salvar, descartar } = useRascunho("nichos");
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {n.map((x) => (
          <Cartao key={x.id} className={cn("flex flex-col gap-3 transition-opacity", !x.ativo && "opacity-60")}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-tx">{x.nome}</span>
              <Interruptor id={`nicho-${x.id}`} rotulo={`Ativar ${x.nome}`} ligado={x.ativo} onChange={(v) => setRascunho(n.map((y) => (y.id === x.id ? { ...y, ativo: v } : y)))} />
            </div>
            <label className="rotulo" htmlFor={`msg-${x.id}`}>
              Mensagem modelo
            </label>
            <textarea
              id={`msg-${x.id}`}
              rows={3}
              className="campo resize-none text-sm"
              value={x.mensagemModelo}
              onChange={(e) => setRascunho(n.map((y) => (y.id === x.id ? { ...y, mensagemModelo: e.target.value } : y)))}
            />
          </Cartao>
        ))}
      </div>
      <p className="text-xs text-tx4">Variáveis: {"{empresa}"} e {"{avaliacao}"}. No WhatsApp Cloud API a mensagem precisa ser um modelo aprovado pela Meta.</p>
      <BarraSalvar sujo={sujo} onSalvar={() => salvar("Nichos de prospecção alterados")} onDescartar={descartar} />
    </div>
  );
}

/* ---------------- SITE ---------------- */
function AbaSite() {
  const { rascunho: s, setRascunho, sujo, salvar, descartar } = useRascunho("site");
  return (
    <Cartao className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Nome" htmlFor="site-nome">
          <input id="site-nome" className="campo" value={s.nome} onChange={(e) => setRascunho({ ...s, nome: e.target.value })} />
        </Campo>
        <Campo rotulo="Slogan" htmlFor="site-slogan">
          <input id="site-slogan" className="campo" value={s.slogan} onChange={(e) => setRascunho({ ...s, slogan: e.target.value })} />
        </Campo>
        <Campo rotulo="WhatsApp comercial (DDI+DDD+número)" htmlFor="site-wpp" dica="Recebe os orçamentos gerados nas calculadoras">
          <input id="site-wpp" className="campo font-mono" inputMode="numeric" value={s.whatsappComercial} onChange={(e) => setRascunho({ ...s, whatsappComercial: e.target.value.replace(/\D/g, "") })} />
        </Campo>
        <NumeroCampo id="site-garantia" rotulo="Garantia exibida" sufixo="anos" valor={s.garantiaAnos} onChange={(n) => setRascunho({ ...s, garantiaAnos: n })} />
        <Campo rotulo="Região atendida em domicílio" htmlFor="site-area">
          <input id="site-area" className="campo" value={s.areaDomicilio} onChange={(e) => setRascunho({ ...s, areaDomicilio: e.target.value })} />
        </Campo>
        <Campo rotulo="Pontos de instalação (um por linha: nome — endereço)" htmlFor="site-pontos" dica="Vazio: o site diz que o ponto mais próximo é informado no orçamento">
          <textarea
            id="site-pontos"
            rows={3}
            className="campo resize-none text-sm"
            value={s.pontosInstalacao.map((p) => `${p.nome} — ${p.endereco}`).join("\n")}
            onChange={(e) =>
              setRascunho({
                ...s,
                pontosInstalacao: e.target.value
                  .split("\n")
                  .filter((l) => l.trim())
                  .map((l) => {
                    const [nome, ...resto] = l.split("—");
                    return { nome: nome.trim(), endereco: resto.join("—").trim() };
                  }),
              })
            }
          />
        </Campo>
      </div>
      <BarraSalvar sujo={sujo} onSalvar={() => salvar("Conteúdo do site alterado")} onDescartar={descartar} />
    </Cartao>
  );
}

/* ---------------- MÓDULOS ---------------- */
function AbaModulos() {
  const { rascunho: m, setRascunho, sujo, salvar, descartar } = useRascunho("modulos");
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {m.map((x) => (
          <Cartao key={x.id} className={cn("flex flex-col gap-3 p-4 sm:p-5", x.ativo && "border-neon/30")}>
            <div className="flex items-center justify-between">
              <Selo tom={x.ativo ? "neon" : "neutro"}>{x.ativo ? "Ativo" : "Novo"}</Selo>
              <Interruptor id={`mod-${x.id}`} rotulo={`Ativar ${x.nome}`} ligado={x.ativo} onChange={(v) => setRascunho(m.map((y) => (y.id === x.id ? { ...y, ativo: v } : y)))} />
            </div>
            <span className="font-semibold leading-tight text-tx">{x.nome}</span>
            <span className="text-sm text-tx4">{x.descricao}</span>
          </Cartao>
        ))}
      </div>
      <BarraSalvar sujo={sujo} onSalvar={() => salvar("Módulos ativados/desativados")} onDescartar={descartar} />
    </div>
  );
}

export function CreatorHub() {
  const { restaurarPadrao, logs } = usePlataforma();
  const [aba, setAba] = useState<string>("geral");
  return (
    <Tabs.Root value={aba} onValueChange={setAba} className="flex flex-col gap-6">
      <div className="-mx-4 overflow-x-auto px-4 sem-barra sm:mx-0 sm:px-0">
        <Tabs.List className="inline-flex min-w-max gap-1 rounded-3xl border border-linha/[0.08] bg-linha/[0.03] p-1.5" aria-label="Seções do Creator Hub">
          {ABAS.map((a) => (
            <Tabs.Trigger
              key={a.id}
              value={a.id}
              className="flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-medium text-tx3 transition-[background-color,color,box-shadow] duration-150 hover:text-tx data-[state=active]:bg-neon/[0.12] data-[state=active]:text-neon data-[state=active]:shadow-[inset_0_0_0_1px_rgba(212,175,106,.35)]"
            >
              <span aria-hidden>{a.icone}</span>
              {a.rotulo}
              {a.id === "auditoria" && logs.length > 0 && <span className="num rounded-full bg-linha/10 px-1.5 font-mono text-[10px] text-tx2">{logs.length}</span>}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      <Tabs.Content value="geral"><AbaGeral /></Tabs.Content>
      <Tabs.Content value="servicos"><AbaServicos /></Tabs.Content>
      <Tabs.Content value="custos"><AbaCustos /></Tabs.Content>
      <Tabs.Content value="financeiro"><AbaFinanceiro /></Tabs.Content>
      <Tabs.Content value="apis"><AbaApis /></Tabs.Content>
      <Tabs.Content value="nichos"><AbaNichos /></Tabs.Content>
      <Tabs.Content value="prospeccao">
        <div className="flex flex-col gap-4">
          <Link href="/admin/prospeccao" className="inline-flex w-fit items-center gap-1.5 text-sm text-neon hover:underline">
            Abrir em página inteira <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <PainelProspeccao />
        </div>
      </Tabs.Content>
      <Tabs.Content value="estoque">
        <div className="flex flex-col gap-4">
          <Link href="/admin/estoque" className="inline-flex w-fit items-center gap-1.5 text-sm text-neon hover:underline">
            Abrir em página inteira <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <PainelEstoque />
        </div>
      </Tabs.Content>
      <Tabs.Content value="site"><AbaSite /></Tabs.Content>
      <Tabs.Content value="modulos"><AbaModulos /></Tabs.Content>
      <Tabs.Content value="auditoria">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button variante="perigo" tamanho="sm" onClick={restaurarPadrao}>
              <RotateCcw className="h-4 w-4" /> Restaurar padrão
            </Button>
          </div>
          <ListaAuditoria />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
