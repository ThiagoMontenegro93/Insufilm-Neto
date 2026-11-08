import Link from "next/link";
import { ArrowUpRight, Car, Eye, Hammer, Home, MapPin, Refrigerator, Shield, ShieldCheck, Sparkles, Sun, Thermometer, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Titulo } from "@/components/ui/primitivos";

type Selo = { icone: LucideIcon; rotulo: string };
type Amostra = { rotulo: string; fundo: string };

type Servico = {
  id: string;
  icone: LucideIcon;
  titulo: string;
  destaque?: string;
  texto: string;
  href: string;
  foto: string;
  alt: string;
  selos?: Selo[];
  amostras?: Amostra[];
};

/* Amostras de acabamento desenhadas em CSS, como as bolinhas da arte. */
const ACABAMENTOS_AUTO: Amostra[] = [
  { rotulo: "Brilhante", fundo: "radial-gradient(circle at 32% 28%, #f5f7fa 0 8%, #6b7280 22%, #111827 58%, #000 100%)" },
  { rotulo: "Fosco", fundo: "radial-gradient(circle at 35% 30%, #4b5563 0%, #1f2937 55%, #111 100%)" },
  { rotulo: "Acetinado", fundo: "radial-gradient(circle at 35% 30%, #9ca3af 0%, #374151 40%, #0b0f17 100%)" },
  { rotulo: "Texturizado", fundo: "repeating-linear-gradient(45deg, #1f2937 0 3px, #111827 3px 6px), #111827" },
];
const ACABAMENTOS_SUPERFICIE: Amostra[] = [
  { rotulo: "Mármore", fundo: "linear-gradient(125deg, transparent 40%, #9ca3af 41%, transparent 43%), linear-gradient(60deg, transparent 62%, #cbd5e1 63%, transparent 65%), radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb)" },
  { rotulo: "Porcelanato", fundo: "radial-gradient(circle at 30% 30%, #fbf5ec, #e7dccb 70%, #d6c7b0)" },
  { rotulo: "Madeira", fundo: "repeating-linear-gradient(100deg, #8a5a2b 0 4px, #a0693a 4px 9px, #7a4c22 9px 12px)" },
  { rotulo: "Fosco", fundo: "radial-gradient(circle at 30% 30%, #e5e7eb, #9ca3af 55%, #4b5563)" },
];

const SERVICOS: Servico[] = [
  {
    id: "insulfilm",
    icone: Car,
    titulo: "Insulfilm",
    destaque: "automotivo",
    texto: "Conforto, privacidade e proteção para o seu carro, com películas de alta performance.",
    href: "/pelicula",
    foto: "/img/aplik-insulfilm.webp",
    alt: "Neto apontando para o vidro de um carro com insulfilm",
    selos: [
      { icone: Sun, rotulo: "Bloqueio de raios UV" },
      { icone: Thermometer, rotulo: "Reduz o calor interno" },
      { icone: Eye, rotulo: "Mais privacidade" },
    ],
  },
  {
    id: "seguranca",
    icone: ShieldCheck,
    titulo: "Películas de segurança",
    destaque: "antivandalismo",
    texto: "Mais resistência contra impactos, tentativas de furto e vandalismo em carros, casas e comércios.",
    href: "/antivandalismo",
    foto: "/img/aplik-seguranca.webp",
    alt: "Neto ao lado de um vidro trincado que a película de segurança manteve no lugar",
    selos: [
      { icone: Hammer, rotulo: "Resiste a impactos" },
      { icone: Zap, rotulo: "Evita estilhaços" },
      { icone: Shield, rotulo: "Mais segurança" },
    ],
  },
  {
    id: "solar",
    icone: Sun,
    titulo: "Proteção solar",
    destaque: "e térmica",
    texto: "Redução de calor, proteção dos estofados e móveis e bloqueio dos raios UV.",
    href: "/#protecao-uv",
    foto: "/img/aplik-solar.webp",
    alt: "Neto de óculos escuros apontando para uma janela com película de controle solar",
  },
  {
    id: "envelopamento",
    icone: Car,
    titulo: "Envelopamento",
    destaque: "automotivo",
    texto: "Personalize, proteja a pintura e valorize o seu veículo. Diversas cores, texturas e acabamentos.",
    href: "/envelopamento",
    foto: "/img/aplik-envelopamento.webp",
    alt: "Neto aplicando vinil preto fosco no capô de um carro",
    amostras: ACABAMENTOS_AUTO,
  },
  {
    id: "superficies",
    icone: Sparkles,
    titulo: "Envelopamento",
    destaque: "de superfícies",
    texto: "Porcelanato e mármore: renove ambientes com elegância, praticidade e baixo custo.",
    href: "/arquitetonico",
    foto: "/img/aplik-superficies.webp",
    alt: "Neto apontando para uma parede revestida em mármore preto",
    amostras: ACABAMENTOS_SUPERFICIE,
  },
  {
    id: "residencial",
    icone: Home,
    titulo: "Insulfilm",
    destaque: "residencial e comercial",
    texto: "Privacidade, controle de luminosidade, conforto térmico e mais segurança para sua casa ou empresa.",
    href: "/arquitetonico",
    foto: "/img/aplik-residencial.webp",
    alt: "Neto apontando para portas de vidro com película em uma casa",
  },
  {
    id: "geladeira",
    icone: Refrigerator,
    titulo: "Envelopamento",
    destaque: "de geladeiras",
    texto: "Transforme sua geladeira com um visual moderno, elegante e personalizado, por valor fechado.",
    href: "/arquitetonico",
    foto: "/img/aplik-geladeira.webp",
    alt: "Neto aplicando vinil preto em uma geladeira inox",
  },
  {
    id: "domicilio",
    icone: MapPin,
    titulo: "Atendimento",
    destaque: "a domicílio",
    texto: "Levamos qualidade, segurança e praticidade até a sua casa, seu veículo ou sua empresa.",
    href: "/#orcamento",
    foto: "/img/aplik-domicilio.webp",
    alt: "Neto de braços cruzados ao lado da van Aplik Films de atendimento a domicílio",
  },
];

/**
 * Os oito serviços das artes Aplik Films: o recorte de cada arte (Neto + serviço), título em caixa alta,
 * texto curto e, embaixo, os selos de benefício ou as amostras de acabamento.
 */
export function ServicosJR() {
  return (
    <section id="servicos" className="scroll-mt-20 bg-fundo2">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-16 sm:px-6 md:py-24">
        <Titulo
          className="mx-auto items-center text-center"
          eyebrow="Nossos serviços"
          titulo={<>Soluções em películas <em>e envelopamento.</em></>}
          descricao="Do carro à geladeira: insulfilm, películas de segurança, proteção solar e envelopamento, com atendimento a domicílio."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="group flex h-full flex-col overflow-hidden cartao-tema rounded-[10px] border bg-sup shadow-[0_24px_48px_-36px_rgba(0,0,0,.8)] transition-[box-shadow,border-color] duration-200 hover:border-ouro/80 hover:shadow-[0_0_40px_-12px_rgba(225,9,20,.7)]"
              >
                <div className="relative aspect-[1000/420] overflow-hidden bg-[#050505]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.foto} alt={s.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 ease-saida group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5 lg:px-6">
                  <h3 className="flex items-start gap-3 text-[15px] font-bold uppercase leading-[1.15] tracking-[0.02em] text-tx">
                    <s.icone className="mt-0.5 h-7 w-7 shrink-0 text-ouro" strokeWidth={1.6} aria-hidden />
                    <span>
                      {s.titulo}
                      {s.destaque && <span className="block text-ouro">{s.destaque}</span>}
                    </span>
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-tx3">{s.texto}</p>
                  <div className="mt-auto border-t border-linha/[0.08] pt-4">
                    {s.selos && (
                      <ul className="grid grid-cols-3 divide-x divide-linha/[0.08]">
                        {s.selos.map((x) => (
                          <li key={x.rotulo} className="flex flex-col items-center gap-2 px-1 text-center">
                            <x.icone className="h-6 w-6 text-tx" strokeWidth={1.4} aria-hidden />
                            <span className="text-[9.5px] font-semibold uppercase leading-tight tracking-[0.04em] text-tx2">{x.rotulo}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.amostras && (
                      <ul className="grid grid-cols-4 gap-1">
                        {s.amostras.map((a) => (
                          <li key={a.rotulo} className="flex flex-col items-center gap-2 text-center">
                            <span className="h-10 w-10 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,.25),0_4px_10px_-4px_rgba(0,0,0,.4)] ring-1 ring-black/10" style={{ background: a.fundo }} aria-hidden />
                            <span className="text-[8px] font-semibold uppercase tracking-[-0.01em] text-tx2">{a.rotulo}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ouro">
                    Ver detalhes <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
