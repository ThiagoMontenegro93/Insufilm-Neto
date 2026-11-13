"use client";

import { ArrowRight, BadgeCheck, Building2, Car, Home, Sparkles, Truck, Wrench } from "lucide-react";
import { AtendimentoLocal } from "@/components/landing/marca";
import { Titulo } from "@/components/ui/primitivos";
import { IconeWhatsapp } from "@/components/ui/contatos";
import { linkInstagram, linkWhatsapp, telefoneFormatado } from "@/lib/contato";
import { usePlataforma } from "@/lib/store";

const DIFERENCIAIS = [
  { icone: Truck, titulo: "Vamos até você", texto: "Casa, garagem, loja ou empresa. A van leva todo o equipamento." },
  { icone: Wrench, titulo: "Aplicação limpa", texto: "Sem bolhas, sem poeira e sem obra. O local fica como estava." },
  { icone: BadgeCheck, titulo: "Garantia por escrito", texto: "Certificado com a linha aplicada e suporte depois do serviço." },
  { icone: Sparkles, titulo: "Quem atende é quem aplica", texto: "Você fala direto com o Neto, do orçamento ao acabamento." },
];

/** Quatro motivos para escolher a Aplik Films, em cartões com ícone. */
export function Diferenciais() {
  return (
    <section className="bg-fundo">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Titulo
          className="lg:sticky lg:top-28 lg:self-start"
          eyebrow="Por que a Aplik"
          titulo={<>Serviço de perto, <em>do jeito certo.</em></>}
          descricao="Película e envelopamento só ficam bons com preparo, produto certo e mão firme. É isso que a gente leva até você."
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {DIFERENCIAIS.map((d, i) => (
            <li
              key={d.titulo}
              className="revelar cartao-tema group relative flex flex-col gap-4 overflow-hidden rounded-[22px] border bg-sup p-7 transition-[border-color] hover:border-ouro/50"
            >
              <span aria-hidden className="num absolute -right-2 -top-6 font-sans text-[7rem] font-extrabold italic leading-none text-linha/[0.05]">
                {i + 1}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-b from-[#f0262f] to-[#a3070e] text-white shadow-[0_14px_30px_-14px_rgba(225,9,20,.9)]">
                <d.icone className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-[1.15rem] font-extrabold uppercase italic leading-tight text-tx">{d.titulo}</h3>
              <p className="text-[14.5px] leading-relaxed text-tx3">{d.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const LUGARES = [
  { icone: Home, rotulo: "Na sua casa" },
  { icone: Car, rotulo: "No seu veículo" },
  { icone: Building2, rotulo: "Na sua empresa" },
];

/** Atendimento a domicílio: foto da van ao lado da chamada, e embaixo o passo a passo e o pedido de orçamento. */
export function Domicilio() {
  const { site } = usePlataforma().config;
  return (
    <section className="bg-fundo2">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <figure className="revelar relative overflow-hidden rounded-[28px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/aplik-van.webp"
              alt="Neto, proprietário da Aplik Films, apontando para a van de atendimento a domicílio"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-[45%_35%] sm:aspect-[16/11]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {LUGARES.map((l) => (
                <span key={l.rotulo} className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-2 text-[12px] font-semibold text-white backdrop-blur-md">
                  <l.icone className="h-4 w-4 text-[#ff3b3b]" aria-hidden /> {l.rotulo}
                </span>
              ))}
            </figcaption>
          </figure>
          <div className="flex flex-col gap-7">
            <Titulo
              eyebrow="Atendimento a domicílio"
              titulo={<>Praticidade e qualidade <em>onde você precisar.</em></>}
              descricao={`Atendemos ${site.areaDomicilio} com hora marcada. Se preferir, você leva o carro ou a peça até um ponto de instalação.`}
            />
            <a
              href={linkWhatsapp(site, "Olá, Aplik Films! Quero agendar uma visita.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-14 w-fit items-center gap-3 rounded-full bg-gradient-to-b from-[#f0262f] to-[#a3070e] pl-2 pr-7 text-[13px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_18px_40px_-16px_rgba(225,9,20,.9)] transition-[filter] hover:brightness-110"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15"><IconeWhatsapp className="h-5 w-5" /></span>
              Agendar visita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          </div>
        </div>
        <AtendimentoLocal />
      </div>
    </section>
  );
}

/** Chamada final antes do rodapé: painel vermelho grande com o WhatsApp. */
export function ChamadaFinal() {
  const { site } = usePlataforma().config;
  return (
    <section className="bg-fundo px-4 pb-20 sm:px-6 md:pb-28">
      <div className="revelar relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f0262f] via-[#c10811] to-[#5c0307] px-6 py-14 text-white shadow-[0_50px_100px_-50px_rgba(225,9,20,.9)] sm:px-12 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 right-10 hidden h-[140%] w-24 -skew-x-[22deg] bg-white/10 md:block" />
          <div className="absolute -bottom-10 right-40 hidden h-[140%] w-6 -skew-x-[22deg] bg-white/10 md:block" />
        </div>
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.24em] text-white/80">Solicite seu orçamento</span>
            <h2 className="text-balance font-sans text-[2.2rem] font-extrabold uppercase italic leading-[0.98] tracking-[-0.01em] sm:text-[3.2rem]">
              Mande uma foto do vidro ou da peça. A gente responde com o preço.
            </h2>
            <p className="max-w-xl text-[15.5px] leading-relaxed text-white/85">
              Orçamento sem compromisso pelo WhatsApp. Se precisar, marcamos uma visita para medir.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={linkWhatsapp(site, "Olá, Aplik Films! Vou mandar uma foto para orçamento.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-16 items-center justify-between gap-3 rounded-full bg-white pl-2 pr-5 sm:pr-7 text-[14px] font-bold text-[#a3070e] shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)] transition-transform hover:-translate-y-0.5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white"><IconeWhatsapp className="h-6 w-6" /></span>
              <span className="num whitespace-nowrap text-[1.1rem] font-extrabold sm:text-[1.25rem]">{telefoneFormatado(site.whatsappComercial)}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
            <a href={linkInstagram(site)} target="_blank" rel="noreferrer" className="text-center text-[13px] font-semibold text-white/85 underline-offset-4 hover:underline">
              ou veja os trabalhos no @{site.instagram.replace(/^@/, "")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
