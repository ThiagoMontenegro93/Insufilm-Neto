import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { CalculadoraAuto } from "@/components/calc/calculadora-auto";
import { GaleriaReels } from "@/components/landing/reels";

export const metadata: Metadata = { title: "Envelopamento automotivo" };

export default function PaginaEnvelopamento() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Calculadora · Envelopamento automotivo"
        titulo="Seu carro em outra cor, sem tocar na pintura."
        descricao="Escolha o porte, a marca do vinil e o acabamento. O total segue a regra m² × (valor base + adicional)."
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-20 sm:px-6">
        <CalculadoraAuto />
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-tx">Total fosco, passo a passo</h2>
          <div className="max-w-md"><GaleriaReels apenas={["auto"]} /></div>
        </section>
      </div>
    </>
  );
}
