"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlataforma } from "@/lib/store";

/**
 * Abertura editorial: foto de showroom em tela cheia (gerada por IA), escurecida à esquerda
 * para a tipografia serifada respirar. Sem brilhos animados; o luxo vem do espaço e da luz.
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
    <section className="relative isolate -mt-px overflow-hidden md:min-h-[92svh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/showroom.webp"
        alt="Sedã preto em showroom de concessionária com piso espelhado e vista noturna da cidade"
        className="absolute inset-x-0 top-0 -z-20 h-[58svh] w-full object-cover object-[64%_50%] md:inset-0 md:h-full md:object-[70%_50%] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] md:[mask-image:none]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] from-45% via-black/40 to-black/0 md:bg-gradient-to-r md:from-black md:from-0% md:via-black/60 md:to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#050505] to-transparent" aria-hidden />

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-16 pt-[40svh] sm:px-6 md:min-h-[92svh] md:justify-center md:pb-24 md:pt-28">
        <div className="flex max-w-2xl flex-col gap-8">
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-10 bg-ouro sm:block" aria-hidden />
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-ouro-soft sm:text-[10.5px] sm:tracking-[0.38em]">Insulfilm · Envelopamento · Películas</p>
          </div>

          <h1 className="font-serif text-[3.1rem] font-light leading-[0.98] tracking-[-0.015em] text-white text-balance sm:text-[4.8rem] lg:text-[5.6rem]">
            Mais do que aparência, <em className="italic text-ouro-soft">é proteção.</em>
          </h1>

          <p className="max-w-lg text-pretty text-[15px] leading-[1.8] text-zinc-300 sm:text-base">
            O acabamento que você vê nas concessionárias, aplicado na sua garagem, na sua empresa ou em um dos nossos pontos de instalação. Com hora marcada e equipe própria.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild tamanho="lg">
              <Link href="#orcamento">
                Solicitar orçamento <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild tamanho="lg" variante="vidro">
              <Link href="/pelicula">Simular preço</Link>
            </Button>
          </div>
        </div>

        <ul className="grid max-w-3xl grid-cols-2 border-t border-white/15 pt-6 sm:grid-cols-4">
          {selos.map((s, i) => (
            <li
              key={s.texto}
              className={`flex items-center gap-2.5 py-2 text-[12px] tracking-wide text-zinc-300 sm:py-0 ${i > 0 ? "sm:border-l sm:border-white/10 sm:pl-5" : ""}`}
            >
              <s.icone className="h-4 w-4 shrink-0 text-ouro" strokeWidth={1.4} aria-hidden />
              {s.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
