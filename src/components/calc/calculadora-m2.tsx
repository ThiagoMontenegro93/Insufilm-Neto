"use client";

/**
 * Calculadora por vãos (m²) e itens de valor fixo. Serve /pelicula e /arquitetonico.
 */
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ItemPreco } from "@/lib/config";
import { brl, precoLinhas, type LinhaOrcamento } from "@/lib/pricing";
import { cn, num } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ResumoOrcamento } from "./resumo-orcamento";

let seq = 0;
const novaLinha = (itemId: string): LinhaOrcamento & { chave: number } => ({ chave: ++seq, itemId, largura: 1.2, altura: 1, quantidade: 1 });

export function CalculadoraM2({ itens, servico, rotuloVao = "Vão" }: { itens: ItemPreco[]; servico: string; rotuloVao?: string }) {
  const [linhas, setLinhas] = useState(() => [novaLinha(itens[0].id)]);

  const resultado = useMemo(() => {
    try {
      return precoLinhas(itens, linhas);
    } catch {
      return { linhas: [], areaTotal: 0, total: 0 };
    }
  }, [itens, linhas]);

  const atualizar = (chave: number, campo: keyof LinhaOrcamento, valor: string | number) =>
    setLinhas((ls) => ls.map((l) => (l.chave === chave ? { ...l, [campo]: valor } : l)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex min-w-0 flex-col gap-4">
        {linhas.map((l, idx) => {
          const item = itens.find((i) => i.id === l.itemId) ?? itens[0];
          const det = resultado.linhas[idx];
          return (
            <fieldset key={l.chave} className="vidro flex flex-col gap-5 p-5">
              <legend className="sr-only">
                {rotuloVao} {idx + 1}
              </legend>
              <div className="flex items-center justify-between">
                <span className="rotulo">
                  {rotuloVao} {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="num font-mono text-sm text-neon">{det ? brl(det.subtotal) : "—"}</span>
                  {linhas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setLinhas((ls) => ls.filter((x) => x.chave !== l.chave))}
                      className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-perigo/10 hover:text-perigo"
                      aria-label={`Remover ${rotuloVao.toLowerCase()} ${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3" role="radiogroup" aria-label="Tipo">
                {itens.map((it) => {
                  const on = it.id === l.itemId;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => atualizar(l.chave, "itemId", it.id)}
                      className={cn(
                        "flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-150",
                        on ? "border-neon/60 bg-neon/[0.08] shadow-neon" : "border-white/[0.08] bg-white/[0.02] hover:border-white/20",
                      )}
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={cn("font-semibold", on ? "text-white" : "text-zinc-200")}>{it.nome}</span>
                        <span className="num shrink-0 font-mono text-xs text-neon">
                          {brl(it.preco)}
                          {it.unidade === "m2" ? "/m²" : ""}
                        </span>
                      </span>
                      <span className="text-xs text-zinc-500">{it.descricao}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {item.unidade === "m2" ? (
                  <>
                    <label className="flex min-w-0 flex-col gap-2">
                      <span className="rotulo">Largura (m)</span>
                      <input id={`larg-${l.chave}`} type="number" inputMode="decimal" min={0} step={0.01} className="campo num font-mono" value={l.largura ?? 0} onChange={(e) => atualizar(l.chave, "largura", Number(e.target.value))} />
                    </label>
                    <label className="flex min-w-0 flex-col gap-2">
                      <span className="rotulo">Altura (m)</span>
                      <input id={`alt-${l.chave}`} type="number" inputMode="decimal" min={0} step={0.01} className="campo num font-mono" value={l.altura ?? 0} onChange={(e) => atualizar(l.chave, "altura", Number(e.target.value))} />
                    </label>
                  </>
                ) : (
                  <p className="col-span-2 self-end pb-3 text-sm text-zinc-400">Valor fechado por unidade.</p>
                )}
                <label className="flex min-w-0 flex-col gap-2">
                  <span className="rotulo">Qtd.</span>
                  <input id={`qtd-${l.chave}`} type="number" inputMode="numeric" min={1} step={1} className="campo num font-mono" value={l.quantidade} onChange={(e) => atualizar(l.chave, "quantidade", Number(e.target.value))} />
                </label>
              </div>
              {det && item.unidade === "m2" && <p className="num font-mono text-xs text-zinc-500">{num(det.area)} m² × {brl(item.preco)}</p>}
            </fieldset>
          );
        })}
        <Button variante="contorno" className="w-fit" onClick={() => setLinhas((ls) => [...ls, novaLinha(itens[0].id)])}>
          <Plus className="h-4 w-4" aria-hidden /> Adicionar {rotuloVao.toLowerCase()}
        </Button>
      </div>

      <ResumoOrcamento
        servico={servico}
        total={resultado.total}
        areaM2={resultado.areaTotal}
        linhas={resultado.linhas.map((d, i) => ({
          rotulo: `${d.item.nome}${d.item.unidade === "m2" ? ` · ${num(d.area)} m²` : ` × ${d.quantidade}`} (${rotuloVao.toLowerCase()} ${i + 1})`,
          valor: d.subtotal,
        }))}
      />
    </div>
  );
}
