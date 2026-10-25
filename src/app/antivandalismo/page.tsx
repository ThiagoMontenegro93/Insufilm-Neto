import type { Metadata } from "next";
import {
  ComoFuncionaAntivandalismo,
  ContextoRio,
  FazNaoFaz,
  HeroAntivandalismo,
  SegmentosAntivandalismo,
} from "@/components/landing/antivandalismo";
import { Calcadao } from "@/components/landing/hero";
import { AtendimentoLocal } from "@/components/landing/marca";
import { PerguntasAntivandalismo } from "@/components/landing/perguntas-antivandalismo";
import { Titulo } from "@/components/ui/primitivos";

export const metadata: Metadata = {
  title: "Película antivandalismo",
  description: "Película antivandalismo para fachadas de vidro, lojas, casas e carros no Rio de Janeiro. O vidro trinca, mas não abre.",
};

export default function PaginaAntivandalismo() {
  return (
    <div className="tema-claro">
      <HeroAntivandalismo />
      <Calcadao />

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-24">
        <Titulo eyebrow="Para quem" titulo={<>Onde tem vidro, <em>tem risco.</em></>} descricao="Quatro lugares onde um vidro quebrado vira prejuízo, susto ou ferimento." />
        <SegmentosAntivandalismo />
      </section>

      <section id="como-funciona" className="mx-auto flex max-w-7xl scroll-mt-24 flex-col gap-8 px-4 pb-16 sm:px-6 md:pb-24">
        <Titulo eyebrow="Como funciona" titulo={<>Três segundos <em>que mudam tudo.</em></>} />
        <ComoFuncionaAntivandalismo />
        <FazNaoFaz />
      </section>

      <ContextoRio />

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-24">
        <Titulo
          eyebrow="Orçamento"
          titulo={<>Avaliamos seus vidros <em>sem compromisso.</em></>}
          descricao="O valor depende da metragem, do tipo de vidro e da linha de película. Mande fotos e medidas pelo WhatsApp ou peça uma visita técnica."
        />
        <AtendimentoLocal servicoInicial="Película antivandalismo" />
      </section>

      <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-16 sm:px-6 md:pb-24">
        <Titulo eyebrow="Dúvidas frequentes" titulo="Antes de proteger." />
        <PerguntasAntivandalismo />
      </section>
      <Calcadao />
    </div>
  );
}
