import { Titulo } from "@/components/ui/primitivos";

type Foto = { src: string; alt: string; w: number; h: number; classe: string };

/** Fotos reais de serviço (painel do Rio em restaurante), sem a faixa de contatos das artes. */
const FOTOS: Foto[] = [
  { src: "/img/trabalho-mural-2.webp", alt: "Restaurante com painel adesivo do Rio nas paredes: Maracanã, Catedral, Arcos da Lapa e orla com o Pão de Açúcar. Neto de braços cruzados no salão", w: 1600, h: 901, classe: "col-span-2 lg:col-span-3 lg:row-span-2" },
  { src: "/img/trabalho-aplicacao-2.webp", alt: "Neto na escada aplicando o painel com o Cristo Redentor e a baía de Guanabara", w: 800, h: 1414, classe: "lg:row-span-2" },
  { src: "/img/trabalho-aplicacao-1.webp", alt: "Neto alisando com pano o painel da orla com prédios e praia", w: 800, h: 1414, classe: "lg:row-span-2" },
  { src: "/img/trabalho-mural-1.webp", alt: "Visão geral do salão com o painel do Rio aplicado em três paredes", w: 1600, h: 901, classe: "sm:col-span-2 lg:col-span-3" },
  { src: "/img/trabalho-aplicacao-3.webp", alt: "Neto ajustando a borda superior do painel do Cristo Redentor", w: 800, h: 1414, classe: "sm:col-span-1 lg:col-span-2" },
];

export function TrabalhosRealizados() {
  return (
    <section id="trabalhos" className="bg-fundo scroll-mt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-24">
        <Titulo
          eyebrow="Trabalhos realizados"
          titulo={<>Painel do Rio <em>em restaurante.</em></>}
          descricao="Adesivo impresso aplicado nas paredes do salão: Maracanã, Catedral, Arcos da Lapa, Cristo Redentor e a orla. Ambiente renovado sem obra, aplicado pelo Neto."
        />
        <ul className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:grid-cols-3 lg:grid-cols-5">
          {FOTOS.map((f) => (
            <li key={f.src} className={`cartao-tema group relative overflow-hidden rounded-[10px] border bg-sup ${f.classe}`}>
              <a href={f.src} target="_blank" rel="noreferrer" className="block h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.alt} width={f.w} height={f.h} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 ease-saida group-hover:scale-[1.03]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
