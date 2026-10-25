"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Home, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlataforma } from "@/lib/store";

/** Torre com película sendo aplicada: a faixa de varredura percorre o vidro e o escudo pulsa. */
function TorreEscudo() {
  const linhas = 16;
  const colunas = 5;
  return (
    <svg viewBox="0 0 420 520" className="h-full w-full" role="img" aria-label="Prédio com escudo azul: película de segurança ativa">
      <defs>
        <linearGradient id="vidroTorre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2418" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <linearGradient id="varredura" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AF6A" stopOpacity="0" />
          <stop offset="0.85" stopColor="#D4AF6A" stopOpacity="0.28" />
          <stop offset="1" stopColor="#F0DBA8" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#D4AF6A" stopOpacity="0.28" />
          <stop offset="1" stopColor="#D4AF6A" stopOpacity="0" />
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
          <path d="M9 0 L18 5.2 L18 15.6 L9 20.8 L0 15.6 L0 5.2 Z M9 20.8 L9 31.2" fill="none" stroke="#D4AF6A" strokeOpacity="0.16" strokeWidth="0.8" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="420" height="520" fill="url(#halo)" />

      {/* prédios vizinhos */}
      <path d="M40 260 L110 250 L110 500 L40 500 Z" fill="#0e0e0e" stroke="#2a2a2a" />
      <path d="M310 200 L380 210 L380 500 L310 500 Z" fill="#0e0e0e" stroke="#2a2a2a" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={`v${i}`} x={52 + (i % 3) * 18} y={275 + Math.floor(i / 3) * 60} width="10" height="22" rx="1" fill="#1d1d22" />
      ))}

      {/* torre principal */}
      <path d="M130 70 L290 50 L290 500 L130 500 Z" fill="url(#vidroTorre)" stroke="#D4AF6A" strokeOpacity="0.35" />
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
              fill={aceso ? "#D4AF6A" : "#D4AF6A"}
              fillOpacity={aceso ? 0.32 : 0.07}
              stroke="#D4AF6A"
              strokeOpacity="0.12"
            />
          );
        })}
        <rect x="130" y="40" width="160" height="470" fill="url(#hex)" />
        <rect x="125" y="0" width="170" height="190" fill="url(#varredura)" className="animate-varredura motion-reduce:hidden" />
      </g>
      <path d="M130 70 L290 50" stroke="#F0DBA8" strokeWidth="2" filter="url(#brilho)" />

      {/* escudo */}
      <g filter="url(#brilho)" className="animate-pulso">
        <path
          d="M210 150 L282 178 V246 C282 300 252 338 210 354 C168 338 138 300 138 246 V178 Z"
          fill="#D4AF6A"
          fillOpacity="0.1"
          stroke="#D4AF6A"
          strokeWidth="2.5"
        />
      </g>
      <path d="M182 250 L203 271 L242 228" fill="none" stroke="#F0DBA8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#brilho)" />

      {/* chão */}
      <path d="M0 500 H420" stroke="#D4AF6A" strokeOpacity="0.4" />
      <ellipse cx="210" cy="502" rx="190" ry="10" fill="#D4AF6A" fillOpacity="0.08" />
    </svg>
  );
}

export function Hero() {
  const { config } = usePlataforma();
  const { taxas, site } = config;
  const selos = [
    { icone: Home, texto: "Atendimento em domicílio" },
    { icone: MapPin, texto: "Pontos de instalação" },
    { icone: Clock3, texto: "Orçamento no mesmo dia" },
    { icone: BadgeCheck, texto: `Garantia de ${site.garantiaAnos} anos` },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="grade-fundo pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[720px] rounded-full bg-ouro/[0.07] blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:pb-20 md:pt-16">
        <div className="flex min-w-0 flex-col gap-7">
          <h1 className="flex flex-col">
            <span className="sr-only">JR Filmes: insulfilm, envelopamento e películas</span>
            <span className="relative w-fit" aria-hidden>
              <span className="display cromado block text-[5.2rem] leading-[0.8] tracking-[-0.07em] sm:text-[8rem] lg:text-[10rem]">JR</span>
              <span className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute inset-y-0 left-0 w-1/4 animate-reflexo bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-overlay motion-reduce:hidden" />
              </span>
              <span className="absolute -right-3 bottom-[8%] h-[7%] w-[34%] -skew-x-[32deg] bg-gradient-to-r from-ouro-soft via-ouro to-ouro-deep sm:-right-5" />
            </span>
            <span className="display cromado block text-[2.9rem] leading-[0.95] tracking-[-0.03em] sm:text-[4.4rem] lg:text-[5.4rem]" aria-hidden>
              Filmes
            </span>
          </h1>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-prata sm:text-[13px] sm:tracking-[0.42em]">Insulfilm | Envelopamento | Películas</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-ouro sm:text-[13px] sm:tracking-[0.42em]">Proteção • Estilo • Sofisticação</p>
          </div>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
            Mais do que aparência, <span className="font-semibold text-ouro">é proteção para o seu dia a dia.</span> Aplicamos na sua casa, na sua empresa ou em um dos nossos pontos de instalação, com hora marcada.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild tamanho="lg">
              <Link href="/pelicula">
                Solicite seu orçamento <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild tamanho="lg" variante="vidro">
              <Link href="/parceiro/dashboard">
                <Sparkles className="h-4 w-4 text-ouro" aria-hidden /> Indique e ganhe {taxas.indicadorPct}%
              </Link>
            </Button>
          </div>

          <ul className="grid max-w-xl grid-cols-2 gap-x-5 gap-y-3">
            {selos.map((s) => (
              <li key={s.texto} className="flex items-center gap-2.5 text-[13px] text-zinc-300">
                <s.icone className="h-4 w-4 shrink-0 text-ouro" strokeWidth={1.6} aria-hidden />
                {s.texto}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-[420/520] w-full max-w-[420px]">
          <TorreEscudo />
          <div className="vidro absolute left-0 top-[14%] hidden flex-col gap-1 rounded-xl px-3.5 py-2.5 sm:flex">
            <span className="rotulo text-[10px]">Bloqueio UV</span>
            <span className="num font-mono text-lg font-semibold text-ouro">até 99%</span>
          </div>
          <div className="vidro absolute bottom-[12%] right-0 flex flex-col gap-1 rounded-xl px-3.5 py-2.5">
            <span className="rotulo text-[10px]">Status</span>
            <span className="flex items-center gap-2 font-mono text-sm font-semibold text-ouro-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-ouro shadow-neon" /> SECURE FILM ACTIVE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
