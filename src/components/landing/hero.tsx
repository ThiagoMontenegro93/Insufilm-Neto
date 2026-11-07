"use client";

import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck, Sun } from "lucide-react";
import { MarcaAplik } from "@/components/layout/navegacao";
import { BlocoContatos } from "@/components/ui/contatos";
import { usePlataforma } from "@/lib/store";

/** Filete diagonal vermelho que separa as faixas, no lugar das ondas do calçadão. */
export function Divisor({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-1.5 w-full overflow-hidden bg-linha/[0.04] ${className}`}>
      <span className="absolute inset-y-0 left-1/2 w-[38%] -translate-x-1/2 -skew-x-[30deg] bg-gradient-to-r from-azul-escuro via-azul to-azul-claro" />
    </div>
  );
}

/** Ícone "UV" da arte: sol com as letras no centro. */
function IconeUV({ className = "" }: { className?: string }) {
  return (
    <span className={`relative grid place-items-center ${className}`} aria-hidden>
      <Sun className="h-full w-full" strokeWidth={1.4} />
      <span className="absolute text-[7px] font-extrabold tracking-tight">UV</span>
    </span>
  );
}

const PROTECOES = [
  { icone: ShieldCheck, texto: "Películas resistentes" },
  { icone: Sun, texto: "Controle térmico" },
  { icone: Lock, texto: "Privacidade" },
  { icone: null, texto: "Proteção UV até 99%" },
];

/**
 * Abertura no padrão das artes Aplik Films: o Neto apontando para o logotipo,
 * faixa vermelha "Peça seu orçamento agora" e o WhatsApp em destaque, tudo sobre o preto com brilho vermelho.
 */
export function Hero() {
  const { config } = usePlataforma();
  const { site } = config;
  return (
    <section className="escuro relative overflow-hidden bg-[#070708]">
      {/* brilhos e cortes vermelhos das artes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-24 h-[28rem] w-[60rem] -rotate-[18deg] bg-gradient-to-r from-[#e10914]/35 via-[#e10914]/5 to-transparent blur-3xl" />
        <div className="absolute -right-10 top-0 h-full w-24 -skew-x-[22deg] bg-gradient-to-b from-[#ff2a33] via-[#e10914]/50 to-transparent opacity-80" />
        <div className="absolute -right-2 top-0 h-full w-3 -skew-x-[22deg] bg-[#ff3b3b]/80 blur-[1px]" />
        <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#e10914]/25 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-end gap-0 px-4 pt-8 sm:px-6 lg:min-h-[640px] lg:grid-cols-[0.95fr_1.05fr] lg:pt-0">
        {/* Neto apontando para a marca */}
        <figure className="relative order-2 mx-auto w-full max-w-[460px] lg:order-1 lg:max-w-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/aplik-neto.webp"
            alt="Neto, proprietário da Aplik Films, de polo preta com o logotipo, apontando para o lado"
            width={432}
            height={650}
            className="w-full [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_80%,transparent),linear-gradient(to_right,transparent,#000_10%,#000_92%,transparent)] [mask-composite:intersect]"
            fetchPriority="high"
          />
          <figcaption className="absolute bottom-10 left-4 rounded-full border border-ouro/70 bg-black/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            Neto <span className="text-ouro">•</span> Proprietário
          </figcaption>
        </figure>

        {/* marca, chamada e contato */}
        <div className="order-1 flex flex-col items-center gap-6 py-6 text-center lg:order-2 lg:items-start lg:py-16 lg:text-left">
          <h1 className="flex flex-col items-center gap-3 lg:items-start">
            <span className="sr-only">Aplik Films: soluções em películas e envelopamento no Rio de Janeiro</span>
            <MarcaAplik className="w-[min(78vw,440px)] drop-shadow-[0_10px_30px_rgba(225,9,20,.35)]" prioridade />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-tx2 sm:text-[13px]" aria-hidden>
              Soluções em películas e envelopamento
            </span>
            <span className="h-0.5 w-full max-w-md bg-gradient-to-r from-transparent via-ouro to-transparent lg:from-ouro" aria-hidden />
          </h1>

          <p className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white sm:gap-x-3 sm:text-[12px] sm:tracking-[0.18em] lg:justify-start">
            {["Proteção", "Segurança", "Privacidade", "Estilo"].map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {i > 0 && <span className="h-3 w-px bg-ouro" aria-hidden />}
                {t}
              </span>
            ))}
          </p>

          <Link
            href="#orcamento"
            className="group relative -skew-x-[8deg] rounded-[8px] border border-ouro/60 bg-black/50 px-6 py-4 shadow-[0_0_50px_-14px_rgba(225,9,20,.9)] transition-[filter] hover:brightness-110"
          >
            <span className="block skew-x-[8deg] font-sans font-extrabold uppercase italic leading-[0.95] text-white">
              <span className="block w-fit rounded-[4px] bg-gradient-to-b from-[#f0262f] to-[#a3070e] px-3 py-1 text-[1.5rem] sm:text-[2rem]">Peça seu</span>
              <span className="block py-1 text-[2.3rem] sm:text-[3.2rem]">orçamento</span>
              <span className="ml-auto block w-fit rounded-[4px] bg-gradient-to-b from-[#f0262f] to-[#a3070e] px-3 py-1 text-[1.5rem] sm:text-[2rem]">
                agora <ArrowRight className="inline h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </span>
          </Link>

          <p className="max-w-md text-pretty text-[14.5px] leading-relaxed text-tx3">
            Insulfilm, películas de segurança, envelopamento automotivo, de superfícies e de geladeiras. Atendimento a domicílio em {site.areaDomicilio}.
          </p>

          <BlocoContatos className="items-center lg:items-start" />

          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-start">
            {PROTECOES.map((p) => (
              <li key={p.texto} className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-tx2">
                {p.icone ? <p.icone className="h-5 w-5 shrink-0 text-ouro" strokeWidth={1.5} aria-hidden /> : <IconeUV className="h-5 w-5 shrink-0 text-ouro" />}
                {p.texto}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Divisor />
    </section>
  );
}
