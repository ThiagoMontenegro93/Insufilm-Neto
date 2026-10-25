import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { StoriesPilares } from "@/components/landing/stories";
import { TimelineEtapas } from "@/components/landing/timeline";
import { GaleriaReels } from "@/components/landing/reels";
import { Titulo } from "@/components/ui/primitivos";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20">
        <Titulo eyebrow="Três pilares" titulo="Proteger, transformar e indicar." descricao="Arraste para o lado no celular. Cada pilar leva direto para a calculadora certa." />
        <StoriesPilares />
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20">
        <Titulo
          eyebrow="Antes e depois em 5 segundos"
          titulo="Veja o serviço acontecer."
          descricao="Cada sequência mostra as etapas reais do serviço com os preços em vigor na plataforma."
        />
        <GaleriaReels />
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-20">
        <div className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
          <Titulo
            eyebrow="Indicação rastreável"
            titulo="Do telefone do cliente até o PIX na sua conta."
            descricao="O telefone vira a chave de rastreio. Ninguém perde a autoria da indicação, e você vê em que etapa cada cliente está."
          />
          <Button asChild tamanho="lg" variante="esmeralda" className="w-fit">
            <Link href="/parceiro/dashboard">
              Começar a indicar <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <TimelineEtapas />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="vidro relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-neon/20 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <span className="rotulo text-neon/80">Para filiais</span>
              <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">Tenha sua filial no HUB e receba indicações prontas.</h2>
              <p className="text-zinc-400">Preços padronizados, orçamento em segundos, repasse automático e painel de prospecção.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild tamanho="lg">
                <Link href="/envelopamento">Simular um orçamento</Link>
              </Button>
              <Button asChild tamanho="lg" variante="vidro">
                <Link href="/admin/creator">Abrir Creator Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
