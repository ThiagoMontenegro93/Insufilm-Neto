"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Home, MapPin } from "lucide-react";
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
 * Abertura solar e carioca: título serifado sobre fundo areia e, logo abaixo,
 * o panorama ilustrado do Rio (gerado por IA) com o calçadão de Copacabana.
 */
export function Hero() {
  const { config } = usePlataforma();
  const { site } = config;
  const selos = [
    { icone: Home, texto: "Em domicílio" },
    { icone: MapPin, texto: "Pontos de instalação" },
    { icone: Clock3, texto: "Orçamento no dia" },
    { icone: BadgeCheck, texto: `Garantia de ${site.garantiaAnos} anos` },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-[#ffd98a]/40 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-10 bg-ouro sm:block" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ouro sm:text-[10.5px] sm:tracking-[0.34em]">Insulfilm · Envelopamento · Películas · Rio de Janeiro</p>
          </div>
          <h1 className="font-serif text-[3rem] font-light leading-[0.98] tracking-[-0.015em] text-tx text-balance sm:text-[4.6rem] lg:text-[5.4rem]">
            Mais do que aparência, <em className="italic text-ouro">é proteção.</em>
          </h1>
        </div>
        <div className="flex flex-col gap-6">
          <p className="max-w-md text-pretty text-[15px] leading-[1.8] text-tx2 sm:text-base">
            Película e envelopamento com acabamento de concessionária, sob o sol do Rio. Vamos até você em {site.areaDomicilio}, ou você nos encontra em um ponto de instalação.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild tamanho="lg">
              <Link href="#orcamento">
                Solicitar orçamento <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild tamanho="lg" variante="contorno">
              <Link href="/pelicula">Simular preço</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/rio-panorama.webp"
          alt="Ilustração do Rio de Janeiro em dia de sol: sedã preto no calçadão, praia, baía de Guanabara e Pão de Açúcar"
          className="aspect-[4/3] w-full object-cover object-[18%_60%] sm:aspect-[2.36/1] sm:object-center"
          fetchPriority="high"
        />
        <ul className="absolute inset-x-4 bottom-4 hidden grid-cols-4 rounded-[3px] bg-white/90 px-6 py-4 shadow-[0_20px_50px_-30px_rgba(14,22,36,.6)] backdrop-blur md:inset-x-auto md:left-1/2 md:grid md:w-[min(900px,calc(100%-3rem))] md:-translate-x-1/2">
          {selos.map((s, i) => (
            <li key={s.texto} className={`flex items-center gap-2.5 text-[12.5px] font-medium text-tx ${i > 0 ? "border-l border-linha/10 pl-5" : ""}`}>
              <s.icone className="h-4 w-4 shrink-0 text-ouro" strokeWidth={1.6} aria-hidden />
              {s.texto}
            </li>
          ))}
        </ul>
      </div>
      <Calcadao />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-6 md:hidden">
        {selos.map((s) => (
          <li key={s.texto} className="flex items-center gap-2.5 text-[13px] font-medium text-tx">
            <s.icone className="h-4 w-4 shrink-0 text-ouro" strokeWidth={1.6} aria-hidden />
            {s.texto}
          </li>
        ))}
      </ul>
    </section>
  );
}
