import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { CalcArquitetonico } from "@/components/calc/paginas";
import { GaleriaReels } from "@/components/landing/reels";

export const metadata: Metadata = { title: "Envelopamento arquitetônico" };

export default function PaginaArquitetonico() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Calculadora · Envelopamento arquitetônico"
        titulo="Mármore, madeira e preto fosco em um dia."
        descricao="Paredes, móveis e objetos são cobrados por m². Geladeira e porta têm valor fechado."
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-20 sm:px-6">
        <CalcArquitetonico />
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">Transformações reais</h2>
          <GaleriaReels apenas={["geladeira", "parede"]} />
        </section>
      </div>
    </>
  );
}
