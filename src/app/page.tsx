import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { ServicosJR } from "@/components/landing/servicos-jr";
import { BotaoWhatsapp, DestaqueAntivandalismo } from "@/components/landing/antivandalismo";
import { ProtecaoSolar } from "@/components/landing/sol";
import { TimelineEtapas } from "@/components/landing/timeline";
import { AtendimentoLocal, ComparativoPeliculas, Perguntas } from "@/components/landing/marca";
import { Titulo } from "@/components/ui/primitivos";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="tema-claro bg-white">
      <Hero />
      <ServicosJR />
      <ProtecaoSolar />
      <DestaqueAntivandalismo />

      <section className="relative">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-28">
          <Titulo
            eyebrow="Onde atendemos"
            titulo={<>Na sua casa <em>ou no nosso ponto.</em></>}
            descricao="Você escolhe: a equipe vai até você com todo o equipamento, ou você leva o carro ou a peça até um ponto de instalação. Nos dois casos, com hora marcada."
          />
          <figure className="relative overflow-hidden rounded-[3px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/jr-casa-piscina.webp"
              alt="Casa moderna com grandes vidros e piscina, com a baía de Guanabara ao fundo"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover object-[50%_40%] sm:aspect-[2.6/1]"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-[3px] bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-tx backdrop-blur">
              Rio de Janeiro e região
            </figcaption>
          </figure>
          <AtendimentoLocal />
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-28">
        <Titulo eyebrow="Linhas de película" titulo="Qual película é para você?" descricao="Um guia rápido para comparar. No orçamento indicamos a linha certa para cada vidro." />
        <ComparativoPeliculas />
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-20">
        <div className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
          <Titulo
            eyebrow="Indique e ganhe"
            titulo="Do telefone do cliente ao PIX na sua conta."
            descricao="O telefone vira a chave de rastreio. Ninguém perde a autoria da indicação, e você vê em que etapa cada cliente está."
          />
          <Button asChild tamanho="lg" className="w-fit">
            <Link href="/parceiro/dashboard">
              Começar a indicar <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <TimelineEtapas />
      </section>

      <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-16 sm:px-6 md:pb-24">
        <Titulo eyebrow="Dúvidas frequentes" titulo="Antes de agendar." />
        <Perguntas />
      </section>
      <BotaoWhatsapp texto="Olá, JR Filmes! Quero um orçamento." />
    </div>
  );
}
