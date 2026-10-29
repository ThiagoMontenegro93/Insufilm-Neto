"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campo, Selo } from "@/components/ui/primitivos";
import { usePlataforma } from "@/lib/store";
import { brl, calcularSplit } from "@/lib/pricing";
import { lerCodigoIndicacao } from "@/lib/referral";
import { cn, num } from "@/lib/utils";

/**
 * Painel lateral comum às calculadoras: total, cupom de indicação, split interno e geração do orçamento.
 */
export function ResumoOrcamento({
  servico,
  linhas,
  total,
  areaM2,
}: {
  servico: string;
  linhas: { rotulo: string; valor: number }[];
  total: number;
  areaM2?: number;
}) {
  const { config } = usePlataforma();
  const [codigo, setCodigo] = useState("");
  const [verSplit, setVerSplit] = useState(false);
  const [gerado, setGerado] = useState<string | null>(null);

  const lido = codigo.trim() ? lerCodigoIndicacao(codigo) : null;
  const codigoInvalido = codigo.trim().length > 0 && !lido;
  const split = calcularSplit(total, config.taxas, { comIndicacao: !!lido, descontoPct: lido ? config.taxas.descontoCupomPct : 0 });

  const mensagem = encodeURIComponent(
    `Olá! Quero um orçamento de ${servico}.\n${linhas.map((l) => `• ${l.rotulo}: ${brl(l.valor)}`).join("\n")}\nTotal estimado: ${brl(split.liquido)}${lido ? `\nCódigo de indicação: ${codigo.trim().toUpperCase()}` : ""}`,
  );

  return (
    <aside className="vidro-forte flex flex-col gap-5 p-5 sm:p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <span className="rotulo">Seu orçamento</span>
        {gerado ? <Selo tom="esmeralda">ORCAMENTO</Selo> : <Selo tom="neon">Estimativa</Selo>}
      </div>

      <ul className="flex flex-col gap-2.5">
        {linhas.length === 0 && <li className="text-sm text-tx4">Adicione um item para ver o valor.</li>}
        {linhas.map((l, i) => (
          <li key={i} className="flex items-baseline justify-between gap-4 text-sm">
            <span className="min-w-0 text-tx3">{l.rotulo}</span>
            <span className="num shrink-0 font-mono text-tx">{brl(l.valor)}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 border-t border-linha/[0.08] pt-5">
        {areaM2 !== undefined && <span className="num font-mono text-xs text-tx4">Área total {num(areaM2)} m²</span>}
        {split.desconto > 0 && <span className="num text-sm text-esmeralda-soft">Desconto do cupom −{brl(split.desconto)}</span>}
        <span className="num text-4xl font-bold tracking-tight text-tx">{brl(split.liquido)}</span>
      </div>

      <Campo rotulo="Código de indicação (opcional)" htmlFor="codigo-indicacao" erro={codigoInvalido ? "Use o formato IND-20240512-JORG-001." : undefined} dica={lido ? `Indicado por ${lido.parceiro}` : "Recebeu um código de alguém? Cole aqui."}>
        <input id="codigo-indicacao" className="campo font-mono uppercase" placeholder="IND-20240512-JORG-001" value={codigo} onChange={(e) => setCodigo(e.target.value)} autoComplete="off" />
      </Campo>

      <div className="rounded-2xl border border-linha/[0.08]">
        <button
          type="button"
          onClick={() => setVerSplit((v) => !v)}
          aria-expanded={verSplit}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-tx2"
        >
          Divisão do valor (visão interna)
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200 ease-saida", verSplit && "rotate-180")} aria-hidden />
        </button>
        {verSplit && (
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-b-2xl border-t border-linha/[0.08] bg-linha/[0.06]">
            {[
              { k: `Você ${config.taxas.plataformaPct}%`, v: split.plataforma, c: "text-neon" },
              { k: `Indicador ${lido ? config.taxas.indicadorPct : 0}%`, v: split.indicador, c: "text-esmeralda-soft" },
              { k: "Locatário", v: split.locatario, c: "text-tx" },
            ].map((s) => (
              <div key={s.k} className="flex flex-col gap-1 bg-sup px-3 py-3">
                <dt className="rotulo text-[10px]">{s.k}</dt>
                <dd className={cn("num font-mono text-sm font-semibold", s.c)}>{brl(s.v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {gerado ? (
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 text-sm text-esmeralda-soft">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Orçamento {gerado} gerado.
          </p>
          <Button asChild variante="esmeralda" tamanho="lg">
            <a href={`https://wa.me/${config.site.whatsappComercial}?text=${mensagem}`} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden /> Enviar pelo WhatsApp
            </a>
          </Button>
        </div>
      ) : (
        <Button tamanho="lg" disabled={total <= 0 || codigoInvalido} onClick={() => setGerado(`ORC-${Date.now().toString(36).toUpperCase().slice(-6)}`)}>
          Gerar orçamento
        </Button>
      )}
      <p className="text-xs leading-relaxed text-tx4">Valor estimado com os preços vigentes. O valor final é confirmado na medição.</p>
    </aside>
  );
}
