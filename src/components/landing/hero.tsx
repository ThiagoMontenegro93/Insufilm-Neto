"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlataforma } from "@/lib/store";
import { brl } from "@/lib/pricing";

/** Torre com película sendo aplicada: a faixa de varredura percorre o vidro e o escudo pulsa. */
function TorreEscudo() {
  const linhas = 16;
  const colunas = 5;
  return (
    <svg viewBox="0 0 420 520" className="h-full w-full" role="img" aria-label="Prédio com escudo azul: película de segurança ativa">
      <defs>
        <linearGradient id="vidroTorre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e2a33" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <linearGradient id="varredura" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00D9FF" stopOpacity="0" />
          <stop offset="0.85" stopColor="#00D9FF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#7DEBFF" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#00D9FF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#00D9FF" stopOpacity="0" />
        </radialGradient>
        <filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="recorteTorre">
          <path d="M130 70 L290 50 L290 500 L130 500 Z" />
        </clipPath>
        <pattern id="hex" width="18" height="31.2" patternUnits="userSpaceOnUse" patternTransform="scale(0.9)">
          <path d="M9 0 L18 5.2 L18 15.6 L9 20.8 L0 15.6 L0 5.2 Z M9 20.8 L9 31.2" fill="none" stroke="#00D9FF" strokeOpacity="0.16" strokeWidth="0.8" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="420" height="520" fill="url(#halo)" />

      {/* prédios vizinhos */}
      <path d="M40 260 L110 250 L110 500 L40 500 Z" fill="#111114" stroke="#27272a" />
      <path d="M310 200 L380 210 L380 500 L310 500 Z" fill="#111114" stroke="#27272a" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={`v${i}`} x={52 + (i % 3) * 18} y={275 + Math.floor(i / 3) * 60} width="10" height="22" rx="1" fill="#1d1d22" />
      ))}

      {/* torre principal */}
      <path d="M130 70 L290 50 L290 500 L130 500 Z" fill="url(#vidroTorre)" stroke="#00D9FF" strokeOpacity="0.35" />
      <g clipPath="url(#recorteTorre)">
        {Array.from({ length: linhas * colunas }).map((_, i) => {
          const c = i % colunas;
          const l = Math.floor(i / colunas);
          const aceso = (i * 7) % 11 === 0;
          return (
            <rect
              key={i}
              x={140 + c * 30}
              y={78 + l * 26}
              width="24"
              height="19"
              rx="1.5"
              fill={aceso ? "#00D9FF" : "#00D9FF"}
              fillOpacity={aceso ? 0.32 : 0.07}
              stroke="#00D9FF"
              strokeOpacity="0.12"
            />
          );
        })}
        <rect x="130" y="40" width="160" height="470" fill="url(#hex)" />
        <rect x="125" y="0" width="170" height="190" fill="url(#varredura)" className="animate-varredura motion-reduce:hidden" />
      </g>
      <path d="M130 70 L290 50" stroke="#7DEBFF" strokeWidth="2" filter="url(#brilho)" />

      {/* escudo */}
      <g filter="url(#brilho)" className="animate-pulso">
        <path
          d="M210 150 L282 178 V246 C282 300 252 338 210 354 C168 338 138 300 138 246 V178 Z"
          fill="#00D9FF"
          fillOpacity="0.1"
          stroke="#00D9FF"
          strokeWidth="2.5"
        />
      </g>
      <path d="M182 250 L203 271 L242 228" fill="none" stroke="#7DEBFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#brilho)" />

      {/* chão */}
      <path d="M0 500 H420" stroke="#00D9FF" strokeOpacity="0.4" />
      <ellipse cx="210" cy="502" rx="190" ry="10" fill="#00D9FF" fillOpacity="0.08" />
    </svg>
  );
}

export function Hero() {
  const { config } = usePlataforma();
  const { taxas, financeiro, site } = config;
  return (
    <section className="relative overflow-hidden">
      <div className="grade-fundo pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-neon/[0.08] blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:pb-24 md:pt-16">
        <div className="flex min-w-0 flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-neon/30 bg-neon/[0.07] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-neon">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
            </span>
            Secure film active
          </span>

          <h1 className="text-balance text-[2.6rem] font-bold leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
            Proteção invisível.
            <br />
            <span className="texto-neon">Design visível.</span>
          </h1>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
            Película de segurança, envelopamento automotivo e arquitetônico com orçamento na hora. Indique um cliente, acompanhe cada etapa pelo código e receba {taxas.indicadorPct}% por PIX quando o serviço fechar.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild tamanho="lg">
              <Link href="/pelicula">
                Calcular minha película <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild tamanho="lg" variante="vidro">
              <Link href="/parceiro/dashboard">
                <Sparkles className="h-4 w-4 text-esmeralda" aria-hidden /> Indicar e ganhar {taxas.indicadorPct}%
              </Link>
            </Button>
          </div>

          <dl className="grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06]">
            {[
              { k: "Garantia", v: `${site.garantiaAnos} anos` },
              { k: "Por indicação", v: `${taxas.indicadorPct}%` },
              { k: "Saque PIX", v: `a partir de ${brl(financeiro.saqueMinimo).replace(",00", "")}` },
            ].map((s) => (
              <div key={s.k} className="flex flex-col gap-1 bg-zinc-950/80 px-3 py-3 sm:px-4">
                <dt className="rotulo text-[10px]">{s.k}</dt>
                <dd className="num text-sm font-semibold text-white sm:text-base">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto aspect-[420/520] w-full max-w-[440px]">
          <TorreEscudo />
          <div className="vidro absolute left-0 top-[14%] hidden flex-col gap-1 rounded-2xl px-3.5 py-2.5 sm:flex">
            <span className="rotulo text-[10px]">Proteção UV</span>
            <span className="num font-mono text-lg font-semibold text-neon">99%</span>
          </div>
          <div className="vidro absolute bottom-[12%] right-0 flex flex-col gap-1 rounded-2xl px-3.5 py-2.5">
            <span className="rotulo text-[10px]">Status</span>
            <span className="flex items-center gap-2 font-mono text-sm font-semibold text-esmeralda-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-esmeralda shadow-esmeralda" /> SECURE FILM ACTIVE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
