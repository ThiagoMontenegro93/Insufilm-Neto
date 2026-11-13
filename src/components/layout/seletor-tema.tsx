"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { usePlataforma } from "@/lib/store";
import { CHAVE_TEMA, TEMAS, temaValido, type TemaId } from "@/lib/temas";
import { cn } from "@/lib/utils";

function lerEscolha(): TemaId | null {
  try {
    const v = localStorage.getItem(CHAVE_TEMA);
    return temaValido(v) ? v : null;
  } catch {
    return null;
  }
}

function aplicar(tema: TemaId) {
  document.documentElement.setAttribute("data-tema", tema);
}

/** Mantém o <html data-tema> em dia com a escolha do visitante ou o padrão do Creator Hub. */
export function AplicarTema() {
  const { config, pronto } = usePlataforma();
  useEffect(() => {
    if (!pronto) return;
    aplicar(lerEscolha() ?? config.site.tema);
  }, [config.site.tema, pronto]);
  return null;
}

/** Botão "Temas" do menu: lista os temas com amostras e troca na hora. */
export function SeletorTema({ className }: { className?: string }) {
  const { config } = usePlataforma();
  const [aberto, setAberto] = useState(false);
  const [atual, setAtual] = useState<TemaId>(config.site.tema);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAtual(lerEscolha() ?? config.site.tema);
  }, [config.site.tema]);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !caixa.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", fechar);
    document.addEventListener("keydown", fechar);
    return () => {
      document.removeEventListener("mousedown", fechar);
      document.removeEventListener("keydown", fechar);
    };
  }, [aberto]);

  if (!config.site.seletorTema) return null;

  const escolher = (id: TemaId) => {
    try {
      localStorage.setItem(CHAVE_TEMA, id);
    } catch {
      /* sem armazenamento: troca só nesta visita */
    }
    aplicar(id);
    setAtual(id);
    setAberto(false);
  };

  return (
    <div ref={caixa} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="listbox"
        className="flex h-10 items-center gap-2 rounded-full border border-linha/15 px-3 text-sm text-tx2 transition-colors hover:border-ouro/50 hover:text-ouro"
      >
        <Palette className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Temas</span>
      </button>
      {aberto && (
        <ul
          role="listbox"
          aria-label="Tema do site"
          className="cartao-tema absolute right-0 top-12 z-50 flex w-[300px] flex-col gap-1 rounded-[10px] border bg-sup p-2 shadow-[0_24px_60px_-20px_rgb(var(--sombra)/.6)]"
        >
          {TEMAS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                role="option"
                aria-selected={atual === t.id}
                onClick={() => escolher(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors",
                  atual === t.id ? "bg-ouro/[0.1]" : "hover:bg-linha/[0.05]",
                )}
              >
                <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-linha/20" aria-hidden>
                  {t.amostra.map((c) => (
                    <span key={c} className="h-6 w-3" style={{ background: c }} />
                  ))}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[13px] font-bold text-tx">{t.nome}</span>
                  <span className="truncate text-[11px] text-tx3">{t.descricao}</span>
                </span>
                {atual === t.id && <Check className="h-4 w-4 shrink-0 text-ouro" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
