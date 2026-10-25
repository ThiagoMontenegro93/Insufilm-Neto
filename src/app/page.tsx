import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { StoriesPilares } from "@/components/landing/stories";
import { TimelineEtapas } from "@/components/landing/timeline";
import { GaleriaReels } from "@/components/landing/reels";
import { AtendimentoLocal, ComparativoPeliculas, FaixaBeneficios, Perguntas, ServicosDiagonais } from "@/components/landing/marca";
import { Titulo } from "@/components/ui/primitivos";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Hero />
      <FaixaBeneficios />

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20">
        <Titulo eyebrow="Nossos serviços" titulo="Do carro à sala de estar." descricao="Insulfilm, envelopamento e películas para veículos, residências, comércios e escritórios." />
        <ServicosDiagonais />
      </section>

      <section className="relative border-y border-white/[0.06] bg-gradient-to-b from-zinc-950 to-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20">
          <Titulo
            eyebrow="Onde atendemos"
            titulo="Na sua casa ou no nosso ponto."
            descricao="Você escolhe: a equipe vai até você com todo o equipamento, ou você leva o carro ou a peça até um ponto de instalação. Nos dois casos, com hora marcada."
          />
          <AtendimentoLocal />
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20">
        <Titulo eyebrow="Proteção • Estilo • Sofisticação" titulo="Escolha pelo que importa." descricao="Arraste para o lado no celular. Cada caminho leva direto para a calculadora certa." />
        <StoriesPilares />
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20">
        <Titulo eyebrow="Antes e depois em 5 segundos" titulo="Veja o serviço acontecer." descricao="Cada sequência mostra as etapas reais do serviço com os preços em vigor." />
        <GaleriaReels />
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20">
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
    </>
  );
}
