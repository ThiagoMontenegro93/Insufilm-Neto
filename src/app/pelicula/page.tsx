import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { CalcPelicula } from "@/components/calc/paginas";
import { GaleriaReels } from "@/components/landing/reels";

export const metadata: Metadata = { title: "Película de segurança" };

export default function PaginaPelicula() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Calculadora · Película de segurança"
        titulo="Quanto custa proteger seus vidros."
        descricao="Informe a largura e a altura de cada vão. O preço por m² vem direto da tabela oficial da plataforma."
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-20 sm:px-6">
        <CalcPelicula />
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-tx">Da jateada à alta rigidez</h2>
          <div className="max-w-md"><GaleriaReels apenas={["pelicula"]} /></div>
        </section>
      </div>
    </>
  );
}
