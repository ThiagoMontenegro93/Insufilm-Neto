"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Home, Sun, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlataforma } from "@/lib/store";

/** Faixa com as ondas do calçadão de Copacabana, usada como divisória carioca. */
export function Calcadao({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-7 w-full bg-[#050505] ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='28' viewBox='0 0 80 28'%3E%3Cpath d='M0 14 C10 0 30 0 40 14 S70 28 80 14 V28 H0Z' fill='%23fbf7ef'/%3E%3C/svg%3E\")",
        backgroundSize: "80px 28px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

/**
 * Abertura solar e carioca: céu claro, brilho de sol e o Rio ao meio-dia (ilustração gerada por IA),
 * com a mensagem de proteção UV, que é o que mais pesa na decisão de quem vive sob esse sol.
 */
export function Hero() {
  const { config } = usePlataforma();
  const { site } = config;
  const selos = [
    { icone: Sun, texto: "Até 99% de bloqueio UV" },
    { icone: Thermometer, texto: "Menos calor no ambiente" },
    { icone: Home, texto: "Em domicílio ou no ponto" },
    { icone: BadgeCheck, texto: `Garantia de ${site.garantiaAnos} anos` },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e3f4fd] via-[#f4fafc] to-[#fbf7ef]">
      {/* brilho do sol do meio-dia */}
      <div className="pointer-events-none absolute -right-24 -top-48 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,#fff3c4_0%,#ffd76a66_38%,transparent_70%)]" aria-hidden />
      <svg className="pointer-events-none absolute -right-10 -top-16 hidden h-[420px] w-[420px] text-[#f5b301]/25 md:block" viewBox="0 0 200 200" aria-hidden>
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1="100" y1="100" x2={100 + 100 * Math.cos((i * Math.PI) / 8)} y2={100 + 100 * Math.sin((i * Math.PI) / 8)} stroke="currentColor" strokeWidth="1.2" />
        ))}
      </svg>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-10 bg-ouro sm:block" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ouro sm:text-[10.5px] sm:tracking-[0.34em]">Proteção solar · Insulfilm · Rio de Janeiro</p>
          </div>
          <h1 className="font-serif text-[2.9rem] font-light leading-[0.98] tracking-[-0.015em] text-tx text-balance sm:text-[4.6rem] lg:text-[5.2rem]">
            Sol do Rio lá fora, <em className="italic text-ouro">pele protegida aqui dentro.</em>
          </h1>
          <a
            href="https://satelite.cptec.inpe.br/uv/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#f5b301]/40 bg-white/80 py-1.5 pl-1.5 pr-4 text-[12.5px] font-medium text-tx shadow-[0_10px_30px_-18px_rgba(245,179,1,.9)] backdrop-blur transition-colors hover:border-[#f5b301]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#ffd54a] to-[#f59e0b] text-white">
              <Sun className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            No verão carioca o índice UV costuma passar de 11, nível extremo
            <ArrowUpRight className="h-3.5 w-3.5 text-tx4" aria-hidden />
          </a>
        </div>
        <div className="flex flex-col gap-6">
          <p className="max-w-md text-pretty text-[15px] leading-[1.8] text-tx2 sm:text-base">
            Películas que bloqueiam até 99% dos raios UV e diminuem o calor no carro, em casa e na loja. Vamos até você em {site.areaDomicilio}, ou você nos encontra em um ponto de instalação.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild tamanho="lg">
              <Link href="#orcamento">
                Solicitar orçamento <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild tamanho="lg" variante="contorno">
              <Link href="#protecao-uv">Por que proteger do UV</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/rio-sol-praia.webp"
          alt="Ilustração de Copacabana ao meio-dia: sol forte no céu azul, guarda-sóis na areia, o calçadão de ondas e o Pão de Açúcar ao fundo"
          className="aspect-[4/3] w-full object-cover object-[30%_50%] sm:aspect-[2.36/1] sm:object-[50%_45%]"
          fetchPriority="high"
        />
        <ul className="absolute inset-x-4 bottom-4 hidden grid-cols-4 rounded-[3px] bg-white/90 px-6 py-4 shadow-[0_20px_50px_-30px_rgba(14,22,36,.6)] backdrop-blur md:inset-x-auto md:left-1/2 md:grid md:w-[min(960px,calc(100%-3rem))] md:-translate-x-1/2">
          {selos.map((s, i) => (
            <li key={s.texto} className={`flex items-center gap-2.5 text-[12.5px] font-medium text-tx ${i > 0 ? "border-l border-linha/10 pl-5" : ""}`}>
              <s.icone className="h-4 w-4 shrink-0 text-[#e09a00]" strokeWidth={1.8} aria-hidden />
              {s.texto}
            </li>
          ))}
        </ul>
      </div>
      <Calcadao />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-6 md:hidden">
        {selos.map((s) => (
          <li key={s.texto} className="flex items-center gap-2.5 text-[13px] font-medium text-tx">
            <s.icone className="h-4 w-4 shrink-0 text-[#e09a00]" strokeWidth={1.8} aria-hidden />
            {s.texto}
          </li>
        ))}
      </ul>
    </section>
  );
}
