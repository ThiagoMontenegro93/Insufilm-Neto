import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { CalcPelicula } from "@/components/calc/paginas";
import { CalculadoraInsulfilm } from "@/components/calc/calculadora-insulfilm";
import { GaleriaReels } from "@/components/landing/reels";

export const metadata: Metadata = { title: "Insulfilm e película de segurança" };

export default function PaginaPelicula() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Calculadora · Insulfilm e película de segurança"
        titulo="Quanto custa proteger seus vidros."
        descricao="No carro, o valor é fechado pelo porte do veículo. Em casa, loja ou escritório, informe a largura e a altura de cada vão."
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-20 sm:px-6">
        <section id="insulfilm" className="flex scroll-mt-24 flex-col gap-5">
          <h2 className="text-2xl font-bold tracking-tight text-tx">Insulfilm automotivo</h2>
          <CalculadoraInsulfilm />
        </section>
        <section id="imoveis" className="flex scroll-mt-24 flex-col gap-5">
          <h2 className="text-2xl font-bold tracking-tight text-tx">Casas, lojas e escritórios</h2>
          <CalcPelicula />
        </section>
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-tx">Da jateada à alta rigidez</h2>
          <div className="max-w-md"><GaleriaReels apenas={["pelicula"]} /></div>
        </section>
      </div>
    </>
  );
}
