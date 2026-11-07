import { Titulo } from "@/components/ui/primitivos";

const ARTES = [
  { src: "/img/aplik-colagem.gif", alt: "Colagem animada da Aplik Films em ação: insulfilm, envelopamento e atendimento a domicílio", w: 309, h: 414 },
  { src: "/img/arte-poster.webp", alt: "Pôster Aplik Films com os oito serviços e os contatos", w: 1086, h: 1448 },
  { src: "/img/arte-orcamento.webp", alt: "Arte 'Peça seu orçamento agora' com o Neto e a lista de serviços", w: 941, h: 1672 },
  { src: "/img/arte-domicilio.webp", alt: "Arte de atendimento a domicílio com o Neto e a van Aplik Films", w: 941, h: 1672 },
  { src: "/img/arte-servicos-1.webp", alt: "Arte com os serviços Aplik Films em destaque", w: 940, h: 1672 },
  { src: "/img/arte-servicos-2.webp", alt: "Arte Aplik Films soluções em películas", w: 941, h: 1672 },
];

/** Vitrine com as artes oficiais da marca, rolando na horizontal no celular. */
export function GaleriaArtes() {
  return (
    <section className="relative overflow-hidden bg-[#070708]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-24">
        <Titulo eyebrow="Aplik Films em ação" titulo={<>Proteção <em>e estilo.</em></>} descricao="As peças oficiais da marca. Toque em uma para ver em tamanho cheio." />
        <ul className="sem-barra -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {ARTES.map((a) => (
            <li key={a.src} className="w-[62vw] max-w-[260px] shrink-0 snap-start">
              <a href={a.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[10px] border border-ouro/30 transition-[border-color,box-shadow] hover:border-ouro/80 hover:shadow-[0_0_40px_-12px_rgba(225,9,20,.7)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt={a.alt} width={a.w} height={a.h} loading="lazy" className="aspect-[9/16] w-full bg-black object-cover object-top" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
