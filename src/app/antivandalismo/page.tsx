import type { Metadata } from "next";
import {
  BeneficiosAntivandalismo,
  BotaoWhatsapp,
  ComoFuncionaAntivandalismo,
  ContextoRio,
  FazNaoFaz,
  HeroAntivandalismo,
  LinhasAntivandalismo,
  ProcessoCompra,
  SegmentosAntivandalismo,
  SeloGarantia,
} from "@/components/landing/antivandalismo";
import { Calcadao } from "@/components/landing/hero";
import { AtendimentoLocal } from "@/components/landing/marca";
import { PerguntasAntivandalismo } from "@/components/landing/perguntas-antivandalismo";
import { Titulo } from "@/components/ui/primitivos";

export const metadata: Metadata = {
  title: "Película antivandalismo",
  description: "Película antivandalismo para fachadas de vidro, lojas, casas e carros no Rio de Janeiro. O vidro trinca, mas não abre.",
};

/** Página de vendas do produto principal: problema, benefícios, linhas com preço, processo, garantia e orçamento. */
export default function PaginaAntivandalismo() {
  return (
    <div className="tema-claro">
      <HeroAntivandalismo />
      <Calcadao />

      <ContextoRio />

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-24">
        <Titulo eyebrow="Benefícios" titulo={<>Proteção que trabalha <em>no pior momento.</em></>} />
        <BeneficiosAntivandalismo />
      </section>

      <section id="linhas" className="mx-auto flex max-w-7xl scroll-mt-24 flex-col gap-10 px-4 pb-16 sm:px-6 md:pb-24">
        <Titulo
          eyebrow="Linhas antivandalismo"
          titulo={<>Escolha o que <em>você quer proteger.</em></>}
          descricao="Cada linha é indicada para um tipo de vidro. No orçamento confirmamos a espessura e o acabamento certos para o seu caso."
        />
        <LinhasAntivandalismo />
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 md:pb-24">
        <Titulo eyebrow="Para quem" titulo={<>Onde tem vidro, <em>tem risco.</em></>} descricao="Quatro lugares onde um vidro quebrado vira prejuízo, susto ou ferimento." />
        <SegmentosAntivandalismo />
      </section>

      <section id="como-funciona" className="mx-auto flex max-w-7xl scroll-mt-24 flex-col gap-8 px-4 pb-16 sm:px-6 md:pb-24">
        <Titulo eyebrow="Como funciona" titulo={<>Três segundos <em>que mudam tudo.</em></>} />
        <ComoFuncionaAntivandalismo />
        <FazNaoFaz />
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-16 sm:px-6 md:pb-24">
        <Titulo eyebrow="Como comprar" titulo={<>Do primeiro contato <em>ao vidro protegido.</em></>} />
        <ProcessoCompra />
        <SeloGarantia />
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 md:pb-24">
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
      <BotaoWhatsapp />
    </div>
  );
}
