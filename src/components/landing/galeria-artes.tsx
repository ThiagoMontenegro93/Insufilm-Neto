import { Titulo } from "@/components/ui/primitivos";

const ARTES = [
  { src: "/img/q-8-servicos.webp", alt: "Os oito serviços da Aplik Films em um só cartaz" },
  { src: "/img/q-seguranca.webp", alt: "Películas de segurança: proteção contra impactos, estilhaços e invasões" },
  { src: "/img/q-antivandalismo-ps8.webp", alt: "Antivandalismo PS8: o vidro trinca mas segura os cacos" },
  { src: "/img/q-solar.webp", alt: "Proteção solar e térmica: menos calor, filtro UV e mais conforto" },
  { src: "/img/q-residenciais.webp", alt: "Películas residenciais: privacidade, conforto térmico e proteção UV" },
  { src: "/img/q-automotivo.webp", alt: "Envelopamento automotivo: novo estilo, personalização e acabamento premium" },
  { src: "/img/q-superficies.webp", alt: "Envelopamento de superfícies: estilo, praticidade e acabamento" },
  { src: "/img/q-geladeiras.webp", alt: "Envelopamento de geladeiras: visual renovado e personalizado" },
  { src: "/img/q-decorativo.webp", alt: "Decorativo sem obra: geladeira preta fosca e armários amadeirados" },
  { src: "/img/q-domicilio.webp", alt: "Atendimento a domicílio: na sua casa, no seu veículo e na sua empresa" },
  { src: "/img/aplik-colagem.gif", alt: "Colagem animada da Aplik Films em ação" },
];

/** Vitrine com as artes oficiais da marca, rolando na horizontal no celular. */
export function GaleriaArtes() {
  return (
    <section className="relative overflow-hidden bg-fundo2">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-24">
        <Titulo eyebrow="Aplik Films em ação" titulo={<>Proteção <em>e estilo.</em></>} descricao="Um criativo para cada serviço. Toque em um para ver em tamanho cheio." />
        <ul className="sem-barra -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {ARTES.map((a) => (
            <li key={a.src} className="w-[72vw] max-w-[300px] shrink-0 snap-start">
              <a href={a.src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[10px] border border-ouro/30 transition-[border-color,box-shadow] hover:border-ouro/80 hover:shadow-[0_0_40px_-12px_rgba(225,9,20,.7)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt={a.alt} width={1000} height={1000} loading="lazy" className="aspect-square w-full bg-black object-cover" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
