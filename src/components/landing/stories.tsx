"use client";

/**
 * Stories dos 3 pilares. No celular: carrossel com toque/arraste e avanço automático (pausa ao tocar).
 * No desktop: três colunas lado a lado.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Brush, Gem, ShieldCheck } from "lucide-react";
import { usePlataforma } from "@/lib/store";
import { brl } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function StoriesPilares() {
  const { config } = usePlataforma();
  const precos = config.servicos.peliculaSeguranca.map((p) => p.preco);
  const marcas = config.servicos.envelopamento.marcas.map((m) => m.preco);
  const arq = config.servicos.arquitetonico.filter((a) => a.unidade === "m2").map((a) => a.preco);

  const pilares = [
    {
      id: "protecao",
      icone: ShieldCheck,
      eyebrow: "Proteção",
      titulo: "Vidro que segura o impacto.",
      texto: "Jateada para privacidade, antivandalismo para fachadas e alta rigidez para quem não pode ter estilhaço.",
      dado: `de ${brl(Math.min(...precos))} a ${brl(Math.max(...precos))}/m²`,
      href: "/pelicula",
      cta: "Calcular película",
      fundo: "from-ouro/20 via-ouro/[0.04] to-transparent",
      cor: "text-ouro",
    },
    {
      id: "design",
      icone: Brush,
      eyebrow: "Estilo",
      titulo: "Carro, parede e geladeira com cara nova.",
      texto: "3M, Avery Dennison e Oracal em brilho, fosco ou cromado. Mármore e madeira para ambientes.",
      dado: `a partir de ${brl(Math.min(...marcas))}/m²`,
      href: "/envelopamento",
      cta: "Simular envelopamento",
      fundo: "from-zinc-500/20 via-zinc-500/[0.04] to-transparent",
      cor: "text-tx",
    },
    {
      id: "renda",
      icone: Gem,
      eyebrow: "Sofisticação",
      titulo: "Mármore, madeira e preto fosco sem obra.",
      texto: "Envelopamento de superfícies e revestimentos decorativos para paredes, móveis, portas e geladeiras.",
      dado: `a partir de ${brl(Math.min(...arq))}/m²`,
      href: "/arquitetonico",
      cta: "Simular superfícies",
      fundo: "from-linha/[0.06] via-linha/[0.02] to-transparent",
      cor: "text-tx2",
    },
  ];

  const trilho = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const irPara = useCallback((i: number) => {
    const el = trilho.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  // sincroniza o índice com o arraste do usuário
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth * 0.86));
      setAtual(Math.min(pilares.length - 1, Math.max(0, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [pilares.length]);

  useEffect(() => {
    if (pausado) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mobile || reduzir) return;
    const t = setTimeout(() => irPara((atual + 1) % pilares.length), 5000);
    return () => clearTimeout(t);
  }, [atual, pausado, irPara, pilares.length]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5 md:hidden" aria-hidden>
        {pilares.map((p, k) => (
          <span key={p.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-linha/10">
            <span
              key={`${atual}-${pausado}`}
              className={cn("block h-full origin-left rounded-full bg-tx", k < atual ? "scale-x-100" : k > atual ? "scale-x-0" : "")}
              style={k === atual ? { animation: pausado ? "none" : "encherStory 5s linear forwards", transform: pausado ? "scaleX(1)" : undefined } : undefined}
            />
          </span>
        ))}
      </div>
      <div
        ref={trilho}
        onPointerDown={() => setPausado(true)}
        onPointerUp={() => setPausado(false)}
        onPointerCancel={() => setPausado(false)}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sem-barra md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Proteção, estilo e sofisticação"
      >
        {pilares.map((p) => {
          const Icone = p.icone;
          return (
            <article
              key={p.id}
              className="relative flex min-h-[420px] rounded-[3px] border border-linha/10 bg-sup w-[86%] shrink-0 snap-center flex-col justify-between overflow-hidden p-6 md:w-auto"
            >
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-b", p.fundo)} aria-hidden />
              <div className="relative flex items-center justify-between">
                <span className={cn("text-[10.5px] font-medium uppercase tracking-[0.38em]", p.cor)}>{p.eyebrow}</span>
                <Icone className={cn("h-5 w-5", p.cor)} strokeWidth={1.3} aria-hidden />
              </div>
              <div className="relative flex flex-col gap-4">
                <h3 className="text-balance font-serif text-[2.1rem] font-light leading-[1.02] text-tx">{p.titulo}</h3>
                <p className="text-[15px] leading-relaxed text-tx2">{p.texto}</p>
                <p className={cn("num text-[12px] uppercase tracking-[0.18em]", p.cor)}>{p.dado}</p>
                <Link href={p.href} className="group mt-2 inline-flex w-fit items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.24em] text-ouro">
                  {p.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-150 ease-saida group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <style>{`@keyframes encherStory{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
    </div>
  );
}
