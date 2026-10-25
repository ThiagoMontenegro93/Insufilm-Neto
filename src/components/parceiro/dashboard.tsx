"use client";

/**
 * Painel do parceiro indicador. Dados de exemplo do parceiro "Seu Jorge" (código JORG)
 * até a API /api/parceiro estar ligada ao banco.
 */
import { useMemo, useState } from "react";
import { BadgeCheck, Banknote, Check, ClipboardCheck, Copy, Handshake, Inbox, PhoneCall, ReceiptText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarraProgresso, Campo, Cartao, Selo, type Tom } from "@/components/ui/primitivos";
import { usePlataforma } from "@/lib/store";
import { brl, calcularSplit } from "@/lib/pricing";
import { ETAPAS_INDICACAO, gerarCodigoIndicacao, mascararTelefone, normalizarTelefone, progressoDe, type StatusIndicacao } from "@/lib/referral";
import { statusInicialSaque, tipoChavePix, validarSaque, type StatusSaque } from "@/lib/payout";
import { cn } from "@/lib/utils";

const PARCEIRO = { nome: "Seu Jorge", codigo: "JORG", idade: 52, kycAprovado: true, pix: "11988887777" };

interface Indicado {
  codigo: string;
  cliente: string;
  telefone: string;
  servico: string;
  valor?: number;
  status: StatusIndicacao;
}

interface Saque {
  id: string;
  valor: number;
  data: string;
  status: StatusSaque;
  posicao?: number;
}

const INDICADOS_INICIAIS: Indicado[] = [
  { codigo: "IND-20240512-JORG-001", cliente: "Maria Silva", telefone: "21999998888", servico: "Película jateada", valor: 1440, status: "ORCAMENTO_GERADO" },
  { codigo: "IND-20240508-JORG-002", cliente: "João Santos", telefone: "21988776655", servico: "Civic total fosco", valor: 1950, status: "FECHADO" },
  { codigo: "IND-20240501-JORG-003", cliente: "Ana Costa", telefone: "21977665544", servico: "Geladeira madeira", valor: 650, status: "PAGO_COMISSAO" },
];

const HISTORICO = [
  { cliente: "Maria", valor: 1000 },
  { cliente: "João", valor: 800 },
  { cliente: "Ana", valor: 1200 },
];

const SAQUES_INICIAIS: Saque[] = [
  { id: "s3", valor: 50, data: "12/05", status: "PENDENTE", posicao: 2 },
  { id: "s2", valor: 100, data: "10/05", status: "APROVADO" },
  { id: "s1", valor: 200, data: "05/05", status: "PAGO" },
];

const ICONES_ETAPA = [Inbox, PhoneCall, ReceiptText, Handshake, Banknote];
const TOM_SAQUE: Record<StatusSaque, Tom> = { PENDENTE: "alerta", APROVADO: "neon", PAGO: "esmeralda", RECUSADO: "perigo" };
const TEXTO_SAQUE: Record<StatusSaque, string> = { PENDENTE: "Na fila", APROVADO: "Aguardando pagamento", PAGO: "Comprovante", RECUSADO: "Recusado" };

function TimelineIndicado({ status }: { status: StatusIndicacao }) {
  const atual = ETAPAS_INDICACAO.findIndex((e) => e.status === status);
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Etapas da indicação">
      {ETAPAS_INDICACAO.map((e, i) => {
        const Icone = ICONES_ETAPA[i];
        const feito = i <= atual;
        return (
          <li key={e.status} className="flex flex-col items-center gap-1.5 text-center">
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-xl border",
                feito ? (i === 4 ? "border-esmeralda/50 bg-esmeralda/15 text-esmeralda" : "border-neon/40 bg-neon/10 text-neon") : "border-white/[0.08] text-zinc-600",
                i === atual && "shadow-neon",
              )}
              title={e.rotulo}
            >
              <Icone className="h-4 w-4" aria-hidden />
            </span>
            <span className={cn("hidden font-mono text-[9px] uppercase leading-tight sm:block", feito ? "text-zinc-300" : "text-zinc-600")}>{e.status.replace("_", " ")}</span>
            <span className="sr-only">
              {e.rotulo} {feito ? "concluída" : "pendente"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function DashboardParceiro() {
  const { config } = usePlataforma();
  const [indicados, setIndicados] = useState(INDICADOS_INICIAIS);
  const [saques, setSaques] = useState(SAQUES_INICIAIS);

  // saldos de exemplo do Seu Jorge; o disponível desconta saques novos feitos nesta sessão
  const novosSaques = saques.filter((s) => !SAQUES_INICIAIS.some((x) => x.id === s.id)).reduce((t, s) => t + s.valor, 0);
  const saldo = { ganho: 450, pago: 200, pendente: 50 + novosSaques, disponivel: 200 - novosSaques };

  /* ----- indicar ----- */
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [cliente, setCliente] = useState("");
  const [categoria, setCategoria] = useState("Película de segurança");
  const [erroInd, setErroInd] = useState<string | null>(null);
  const [ultimoCodigo, setUltimoCodigo] = useState<string | null>(null);
  const telNorm = normalizarTelefone(tel);

  function indicar(e: React.FormEvent) {
    e.preventDefault();
    if (!telNorm) return setErroInd("Telefone inválido. Use DDD + número, ex.: 21 99999-8888.");
    if (indicados.some((i) => i.telefone === telNorm)) return setErroInd("Esse telefone já foi indicado. A autoria continua com a primeira indicação.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErroInd("E-mail inválido.");
    const hoje = new Date();
    const codigo = gerarCodigoIndicacao(PARCEIRO.codigo, hoje, indicados.length + 1);
    setIndicados((l) => [{ codigo, cliente: cliente.trim() || "Cliente sem nome", telefone: telNorm, servico: categoria, status: "PENDENTE" }, ...l]);
    setUltimoCodigo(codigo);
    setErroInd(null);
    setTel("");
    setEmail("");
    setCliente("");
  }

  /* ----- saque com dupla confirmação ----- */
  const [valorSaque, setValorSaque] = useState("");
  const [chave, setChave] = useState(PARCEIRO.pix);
  const [etapaSaque, setEtapaSaque] = useState<"form" | "confirmar" | "enviado">("form");
  const [confirmacao, setConfirmacao] = useState("");
  const [errosSaque, setErrosSaque] = useState<string[]>([]);
  const valorNum = Number(valorSaque.replace(",", "."));
  const ultimos4 = chave.replace(/\W/g, "").slice(-4);

  function revisarSaque(e: React.FormEvent) {
    e.preventDefault();
    const erros = validarSaque({ valor: valorNum, disponivel: saldo.disponivel, idade: PARCEIRO.idade, kycAprovado: PARCEIRO.kycAprovado, chavePix: chave }, config.financeiro);
    setErrosSaque(erros);
    if (erros.length === 0) setEtapaSaque(config.financeiro.duplaConfirmacaoPix ? "confirmar" : "enviado");
  }

  function confirmarSaque() {
    if (confirmacao !== ultimos4) return setErrosSaque([`Digite os 4 últimos caracteres da chave (${ultimos4.length} caracteres).`]);
    const status = statusInicialSaque(valorNum, config.financeiro);
    const pendentes = saques.filter((s) => s.status === "PENDENTE").length;
    const hoje = new Date();
    setSaques((l) => [{ id: crypto.randomUUID(), valor: valorNum, data: `${String(hoje.getDate()).padStart(2, "0")}/${String(hoje.getMonth() + 1).padStart(2, "0")}`, status, posicao: status === "PENDENTE" ? pendentes + 1 : undefined }, ...l]);
    setEtapaSaque("enviado");
    setErrosSaque([]);
  }

  const comissaoMaria = useMemo(() => calcularSplit(1440, config.taxas).indicador, [config.taxas]);

  return (
    <div className="flex flex-col gap-8">
      {/* saldos */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
        {[
          { k: "Total já ganho", v: saldo.ganho, c: "text-white", b: "" },
          { k: "Total já pago", v: saldo.pago, c: "text-neon", b: "" },
          { k: "Pendente na fila", v: saldo.pendente, c: "text-alerta", b: "" },
        ].map((s) => (
          <Cartao key={s.k} className={cn("flex flex-col gap-2 p-4 sm:p-5", s.b)}>
            <span className="rotulo text-[10px]">{s.k}</span>
            <span className={cn("num text-2xl font-bold tracking-tight sm:text-3xl", s.c)}>{brl(s.v)}</span>
          </Cartao>
        ))}
        <Cartao className="col-span-2 flex flex-col justify-between gap-2 border-esmeralda/30 bg-esmeralda/[0.06] p-4 shadow-esmeralda sm:p-5 lg:col-span-1">
          <span className="rotulo text-[10px] text-esmeralda-soft">Disponível para saque</span>
          <span className="num text-4xl font-bold tracking-tight text-esmeralda sm:text-5xl">{brl(saldo.disponivel)}</span>
        </Cartao>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* PIX */}
        <Cartao forte className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Solicitar PIX</h2>
            <Selo tom={PARCEIRO.kycAprovado ? "esmeralda" : "alerta"}>
              {PARCEIRO.kycAprovado ? <BadgeCheck className="h-3.5 w-3.5" /> : null} KYC {PARCEIRO.kycAprovado ? "aprovado" : "pendente"}
            </Selo>
          </div>

          {etapaSaque === "form" && (
            <form onSubmit={revisarSaque} className="flex flex-col gap-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo rotulo="Valor para sacar" htmlFor="saque-valor" dica={`Mínimo ${brl(config.financeiro.saqueMinimo)} · disponível ${brl(saldo.disponivel)}`}>
                  <input id="saque-valor" inputMode="decimal" className="campo num font-mono" placeholder="Ex: 100" value={valorSaque} onChange={(e) => setValorSaque(e.target.value)} />
                </Campo>
                <Campo rotulo="PIX para receber" htmlFor="saque-chave" dica={tipoChavePix(chave) ? `Chave ${tipoChavePix(chave)?.toLowerCase()} · pode alterar na hora` : "CPF, telefone, e-mail ou aleatória"}>
                  <input id="saque-chave" className="campo font-mono" value={chave} onChange={(e) => setChave(e.target.value)} autoComplete="off" />
                </Campo>
              </div>
              {errosSaque.length > 0 && (
                <ul className="flex flex-col gap-1 text-sm text-perigo">
                  {errosSaque.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
              <Button type="submit" variante="esmeralda" tamanho="lg">
                Solicitar PIX
              </Button>
            </form>
          )}

          {etapaSaque === "confirmar" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-alerta/30 bg-alerta/[0.06] p-4">
                <p className="rotulo text-alerta">Confirmação 2 de 2</p>
                <p className="mt-2 text-white">
                  Enviar <span className="num font-bold">{brl(valorNum)}</span> para a chave <span className="font-mono">{chave}</span>?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {valorNum <= config.financeiro.autoAprovacaoAte ? "Até " + brl(config.financeiro.autoAprovacaoAte) + " a aprovação é automática." : "Acima de " + brl(config.financeiro.autoAprovacaoAte) + " o pedido passa por aprovação manual."}
                </p>
              </div>
              <Campo rotulo="Digite os 4 últimos caracteres da chave" htmlFor="saque-conf">
                <input id="saque-conf" className="campo font-mono tracking-[0.4em]" maxLength={4} value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} autoComplete="off" />
              </Campo>
              {errosSaque.length > 0 && <p className="text-sm text-perigo">{errosSaque[0]}</p>}
              <div className="flex gap-3">
                <Button variante="fantasma" onClick={() => { setEtapaSaque("form"); setConfirmacao(""); }}>
                  Voltar
                </Button>
                <Button variante="esmeralda" className="flex-1" onClick={confirmarSaque}>
                  <ShieldCheck className="h-4 w-4" /> Confirmar PIX
                </Button>
              </div>
            </div>
          )}

          {etapaSaque === "enviado" && (
            <div className="flex flex-col items-start gap-3">
              <p className="flex items-center gap-2 font-medium text-esmeralda-soft">
                <Check className="h-5 w-5" /> Pedido registrado na fila.
              </p>
              <Button variante="vidro" tamanho="sm" onClick={() => { setEtapaSaque("form"); setValorSaque(""); setConfirmacao(""); }}>
                Fazer outro pedido
              </Button>
            </div>
          )}
          <p className="text-xs leading-relaxed text-zinc-500">Toda solicitação fica registrada. Você recebe aviso no WhatsApp quando o pedido for aprovado e quando o PIX for pago.</p>
        </Cartao>

        {/* indicar */}
        <Cartao className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-white">Indicar para orçamento</h2>
          <form onSubmit={indicar} className="flex flex-col gap-4" noValidate>
            <Campo rotulo="Telefone do cliente · rastreio principal" htmlFor="ind-tel" dica={telNorm ? `Normalizado: ${telNorm}` : "Esse número prende a indicação ao seu código"}>
              <input
                id="ind-tel"
                inputMode="tel"
                className="campo border-alerta/60 font-mono focus:border-alerta focus:shadow-[0_0_0_4px_rgba(250,204,21,.12)]"
                placeholder="(21) 99999-8888"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />
            </Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo rotulo="Nome do cliente" htmlFor="ind-nome">
                <input id="ind-nome" className="campo" placeholder="Maria Silva" value={cliente} onChange={(e) => setCliente(e.target.value)} />
              </Campo>
              <Campo rotulo="E-mail (opcional)" htmlFor="ind-email">
                <input id="ind-email" type="email" className="campo" placeholder="cliente@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Campo>
            </div>
            <Campo rotulo="Categoria" htmlFor="ind-cat">
              <select id="ind-cat" className="campo" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {["Película de segurança", "Envelopamento automotivo", "Envelopamento arquitetônico", "Geladeira", "Parede / móveis"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Campo>
            {erroInd && <p className="text-sm text-perigo">{erroInd}</p>}
            <Button type="submit">Gerar código de indicação</Button>
          </form>
          {ultimoCodigo && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-neon/30 bg-neon/[0.06] p-4">
              <div className="min-w-0">
                <p className="rotulo">Código gerado</p>
                <p className="truncate font-mono text-neon">{ultimoCodigo}</p>
              </div>
              <Button
                variante="vidro"
                tamanho="icone"
                aria-label="Copiar código"
                onClick={() => {
                  navigator.clipboard?.writeText(ultimoCodigo).catch(() => undefined);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Cartao>
      </div>

      {/* meus indicados */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-white">Meus indicados</h2>
          <span className="font-mono text-xs text-zinc-500">{indicados.length} no total</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {indicados.map((i) => {
            const p = progressoDe(i.status);
            const etapa = ETAPAS_INDICACAO.find((e) => e.status === i.status)!;
            return (
              <Cartao key={i.codigo} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{i.cliente}</p>
                    <p className="text-sm text-zinc-400">{i.servico}</p>
                  </div>
                  <span className="num shrink-0 font-mono text-lg font-semibold text-white">{i.valor ? brl(i.valor) : "—"}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <Selo tom={p === 100 ? "esmeralda" : p >= 60 ? "neon" : "alerta"}>{etapa.rotulo}</Selo>
                    <span className="num font-mono text-zinc-400">{p}%</span>
                  </div>
                  <BarraProgresso valor={p} tom={p === 100 ? "esmeralda" : p >= 60 ? "neon" : "alerta"} />
                </div>
                <TimelineIndicado status={i.status} />
                <dl className="grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3 font-mono text-[11px]">
                  <div>
                    <dt className="text-zinc-600">Código</dt>
                    <dd className="truncate text-neon/90">{i.codigo}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-600">Telefone</dt>
                    <dd className="text-zinc-300" title={mascararTelefone(i.telefone)}>
                      {i.telefone}
                    </dd>
                  </div>
                </dl>
                {i.status === "ORCAMENTO_GERADO" && i.valor === 1440 && <p className="text-xs text-zinc-500">Se fechar, sua comissão será {brl(comissaoMaria)}.</p>}
              </Cartao>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Cartao className="flex flex-col gap-4">
          <h2 className="font-semibold text-white">Histórico de saldo gerado</h2>
          <ul className="flex flex-col divide-y divide-white/[0.06]">
            {HISTORICO.map((h) => (
              <li key={h.cliente} className="flex items-center justify-between py-3 text-sm">
                <span className="text-zinc-300">
                  Cliente {h.cliente} <span className="num font-mono text-zinc-500">· {brl(h.valor)}</span>
                </span>
                <span className="num font-mono font-semibold text-esmeralda-soft">+{brl(calcularSplit(h.valor, config.taxas).indicador)}</span>
              </li>
            ))}
          </ul>
        </Cartao>
        <Cartao className="flex flex-col gap-4">
          <h2 className="font-semibold text-white">Fila de saques</h2>
          <ul className="flex flex-col divide-y divide-white/[0.06]">
            {saques.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="num font-mono text-white">
                  {brl(s.valor)} <span className="text-zinc-500">· {s.data}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Selo tom={TOM_SAQUE[s.status]}>{s.status}</Selo>
                  <span className="text-xs text-zinc-400">
                    {s.status === "PENDENTE" && s.posicao ? `Posição #${s.posicao}` : TEXTO_SAQUE[s.status]}
                  </span>
                  {s.status === "PAGO" && <ClipboardCheck className="h-4 w-4 text-esmeralda" aria-label="Comprovante disponível" />}
                </span>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>
    </div>
  );
}
