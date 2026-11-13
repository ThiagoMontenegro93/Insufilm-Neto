"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight, BadgeCheck, MapPin, ShieldCheck, Sun } from "lucide-react";
import { IconeWhatsapp } from "@/components/ui/contatos";
import { linkWhatsapp, telefoneFormatado } from "@/lib/contato";
import { usePlataforma } from "@/lib/store";

/** Filete diagonal vermelho que separa as faixas. */
export function Divisor({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-1.5 w-full overflow-hidden bg-linha/[0.04] ${className}`}>
      <span className="absolute inset-y-0 left-1/2 w-[38%] -translate-x-1/2 -skew-x-[30deg] bg-gradient-to-r from-azul-escuro via-azul to-azul-claro" />
    </div>
  );
}

const SERVICOS_FAIXA = [
  "Insulfilm automotivo",
  "Películas de segurança",
  "Proteção solar e UV",
  "Envelopamento automotivo",
  "Porcelanato e mármore",
  "Insulfilm residencial",
  "Envelopamento de geladeiras",
  "Atendimento a domicílio",
];

/** Faixa que rola sozinha com os serviços, separando o topo do resto da página. */
export function FaixaServicos() {
  const itens = [...SERVICOS_FAIXA, ...SERVICOS_FAIXA];
  return (
    <div className="relative overflow-hidden border-y border-linha/[0.08] bg-fundo2 py-4" aria-label="Serviços">
      <ul className="faixa-rolando flex w-max items-center gap-8 whitespace-nowrap">
        {itens.map((s, i) => (
          <li key={i} aria-hidden={i >= SERVICOS_FAIXA.length} className="flex items-center gap-8 text-[13px] font-extrabold uppercase italic tracking-[0.04em] text-tx sm:text-[15px]">
            {s}
            <span className="h-2 w-2 rotate-45 bg-[#e10914]" aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Abertura moderna: título grande à esquerda, dois botões claros e a foto do Neto num cartão
 * com etiquetas flutuantes. Os contatos completos ficam no rodapé e no botão do WhatsApp.
 */
export function Hero() {
  const { site } = usePlataforma().config;
  return (
    <section className="bg-fundo relative overflow-hidden">
      <div aria-hidden className="brilho-tema pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-[#e10914]/25 blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full bg-[#e10914]/10 blur-[100px]" />
        <div className="grade-fundo absolute inset-0" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-linha/15 bg-sup/60 py-1.5 pl-1.5 pr-4 text-[12px] font-semibold text-tx2 backdrop-blur">
            <span className="flex items-center gap-1 rounded-full bg-[#e10914] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white">
              <MapPin className="h-3 w-3" aria-hidden /> RJ
            </span>
            Atendimento a domicílio em {site.areaDomicilio}
          </span>

          <h1 className="text-balance font-sans text-[2.6rem] font-extrabold uppercase italic leading-[0.95] tracking-[-0.02em] text-tx sm:text-[3.6rem] lg:text-[4.4rem]">
            <span className="sr-only">Aplik Films: </span>
            Proteção e estilo{" "}
            <span className="bg-gradient-to-r from-[#ff3b3b] to-[#b8070f] bg-clip-text pr-2 text-transparent">para cada vidro</span>{" "}
            e superfície.
          </h1>

          <p className="max-w-xl text-pretty text-[16px] leading-relaxed text-tx3 sm:text-[17px]">
            Insulfilm, películas de segurança, controle solar e envelopamento de carros, móveis e geladeiras. O Neto vai até você com todo o equipamento e deixa tudo limpo.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={linkWhatsapp(site, "Olá, Aplik Films! Quero um orçamento.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#f0262f] to-[#a3070e] pl-2 pr-7 text-[13px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_18px_40px_-16px_rgba(225,9,20,.9)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
                <IconeWhatsapp className="h-5 w-5" />
              </span>
              Pedir orçamento
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
            <Link
              href="#servicos"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-linha/20 px-7 text-[13px] font-bold uppercase tracking-[0.1em] text-tx transition-colors hover:border-ouro/60 hover:text-ouro"
            >
              Ver serviços <ArrowDownRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <dl className="grid max-w-xl grid-cols-3 gap-4 border-t border-linha/[0.1] pt-6">
            {[
              { n: "8", r: "serviços em um só lugar" },
              { n: "99%", r: "de bloqueio UV nas linhas certas" },
              { n: `${site.garantiaAnos} anos`, r: "de garantia, conforme a linha" },
            ].map((x) => (
              <div key={x.r} className="flex flex-col gap-1">
                <dt className="order-2 text-[12px] leading-snug text-tx3">{x.r}</dt>
                <dd className="num order-1 font-sans text-[1.7rem] font-extrabold italic leading-none text-tx sm:text-[2.1rem]">{x.n}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="relative mx-auto w-full max-w-[460px]">
          <div className="cartao-tema relative overflow-hidden rounded-[28px] border bg-gradient-to-b from-[#1a0507] to-[#050505] shadow-[0_40px_90px_-40px_rgba(225,9,20,.8)]">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(225,9,20,.45),transparent_60%)]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/aplik-neto.webp"
              alt="Neto, proprietário da Aplik Films, de polo preta com o logotipo, apontando para o lado"
              width={432}
              height={650}
              className="relative w-full [mask-image:linear-gradient(to_bottom,#000_75%,transparent)]"
              fetchPriority="high"
            />
            <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/55 px-4 py-3 text-white backdrop-blur-md">
              <span className="flex flex-col">
                <span className="text-[14px] font-bold">Neto</span>
                <span className="text-[11.5px] text-white/70">Proprietário e aplicador</span>
              </span>
              <a href={linkWhatsapp(site, "Olá, Neto! Quero um orçamento.")} target="_blank" rel="noreferrer" className="num text-[13px] font-bold text-white underline-offset-4 hover:underline">
                {telefoneFormatado(site.whatsappComercial)}
              </a>
            </figcaption>
          </div>

          <div className="absolute -left-4 top-10 flex items-center gap-2.5 rounded-2xl border border-linha/15 bg-sup/90 px-3.5 py-2.5 shadow-[0_20px_40px_-20px_rgb(var(--sombra)/.7)] backdrop-blur sm:-left-10">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e10914]/15 text-[#e10914]"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
            <span className="flex flex-col leading-tight">
              <span className="text-[12.5px] font-bold text-tx">Antivandalismo</span>
              <span className="text-[11px] text-tx3">O vidro trinca e não abre</span>
            </span>
          </div>
          <div className="absolute -right-3 top-1/2 flex items-center gap-2.5 rounded-2xl border border-linha/15 bg-sup/90 px-3.5 py-2.5 shadow-[0_20px_40px_-20px_rgb(var(--sombra)/.7)] backdrop-blur sm:-right-8">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400/15 text-amber-500"><Sun className="h-5 w-5" aria-hidden /></span>
            <span className="flex flex-col leading-tight">
              <span className="text-[12.5px] font-bold text-tx">Menos calor</span>
              <span className="text-[11px] text-tx3">Controle solar e UV</span>
            </span>
          </div>
          <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-linha/15 bg-sup/90 px-4 py-2 text-[11.5px] font-semibold text-tx2 backdrop-blur sm:flex">
            <BadgeCheck className="h-4 w-4 text-[#e10914]" aria-hidden />
            <span className="ml-1">Garantia com certificado</span>
          </div>
        </figure>
      </div>
      <FaixaServicos />
    </section>
  );
}
