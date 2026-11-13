import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { ServicosJR } from "@/components/landing/servicos-jr";
import { GaleriaArtes } from "@/components/landing/galeria-artes";
import { TrabalhosRealizados } from "@/components/landing/trabalhos";
import { BotaoWhatsapp, DestaqueAntivandalismo } from "@/components/landing/antivandalismo";
import { ProtecaoSolar } from "@/components/landing/sol";
import { TimelineEtapas } from "@/components/landing/timeline";
import { ComparativoPeliculas, Perguntas } from "@/components/landing/marca";
import { ChamadaFinal, Diferenciais, Domicilio } from "@/components/landing/moderno";
import { Titulo } from "@/components/ui/primitivos";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-fundo">
      <Hero />
      <ServicosJR />
      <Diferenciais />
      <TrabalhosRealizados />
      <DestaqueAntivandalismo />
      <GaleriaArtes />
      <ProtecaoSolar />

      <Domicilio />

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
      <ChamadaFinal />
      <BotaoWhatsapp texto="Olá, Aplik Films! Quero um orçamento." />
    </div>
  );
}
