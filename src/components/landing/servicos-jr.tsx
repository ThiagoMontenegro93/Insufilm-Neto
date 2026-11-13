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

const LAYOUT = [
  "sm:col-span-2",
  "",
  "",
  "",
  "",
  "",
  "",
  "sm:col-span-2 lg:col-span-4",
];

/**
 * Os oito serviços em grade "bento": o principal grande, os outros em cartões menores,
 * cada um com o recorte da arte, número, texto curto e selos ou amostras de acabamento.
 */
export function ServicosJR() {
  return (
    <section id="servicos" className="scroll-mt-20 bg-fundo2">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Titulo
            eyebrow="Nossos serviços"
            titulo={<>Soluções em películas <em>e envelopamento.</em></>}
            descricao="Do carro à geladeira, com o mesmo cuidado. Escolha um serviço para ver detalhes e simular o preço."
          />
          <Link href="#orcamento" className="inline-flex h-12 w-fit shrink-0 items-center gap-2 rounded-full border border-linha/20 px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-tx transition-colors hover:border-ouro/60 hover:text-ouro">
            Montar orçamento <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICOS.map((s, i) => {
            const grande = i === 0;
            const largo = i === SERVICOS.length - 1;
            return (
              <li key={s.id} className={`revelar ${LAYOUT[i]}`}>
                <Link
                  href={s.href}
                  className={`group relative flex h-full flex-col gap-4 ${largo ? "lg:flex-row lg:items-center lg:gap-8" : ""} overflow-hidden rounded-[22px] border border-linha/[0.1] bg-sup p-3 transition-[border-color,box-shadow,transform] duration-300 ease-saida hover:-translate-y-1 hover:border-ouro/60 hover:shadow-[0_30px_60px_-30px_rgba(225,9,20,.7)] cartao-tema`}
                >
                  <div className={`relative overflow-hidden rounded-[16px] bg-[#050505] aspect-[1000/420] ${largo ? "lg:w-1/2 lg:shrink-0" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.foto} alt={s.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-saida group-hover:scale-[1.05]" />
                    <span className="num absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-extrabold uppercase italic leading-[1.05] tracking-[-0.005em] text-tx ${grande || largo ? "text-[1.4rem] sm:text-[1.8rem]" : "text-[1.05rem]"}`}>
                        {s.titulo}
                        {s.destaque && <span className="block text-ouro">{s.destaque}</span>}
                      </h3>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-linha/15 text-tx transition-colors group-hover:border-transparent group-hover:bg-[#e10914] group-hover:text-white" aria-hidden>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-45" />
                      </span>
                    </div>
                    <p className={`leading-relaxed text-tx3 ${grande || largo ? "max-w-lg text-[15px]" : "text-[13.5px]"}`}>{s.texto}</p>
                    {(s.selos || s.amostras) && (
                      <div className="mt-auto pt-2">
                        {s.selos && (
                          <ul className="flex flex-wrap gap-2">
                            {s.selos.map((x) => (
                              <li key={x.rotulo} className="flex items-center gap-1.5 rounded-full border border-linha/[0.12] bg-linha/[0.04] px-3 py-1.5 text-[11px] font-semibold text-tx2">
                                <x.icone className="h-3.5 w-3.5 text-ouro" strokeWidth={1.8} aria-hidden />
                                {x.rotulo}
                              </li>
                            ))}
                          </ul>
                        )}
                        {s.amostras && (
                          <ul className="flex flex-wrap gap-3">
                            {s.amostras.map((a) => (
                              <li key={a.rotulo} className="flex items-center gap-2">
                                <span className="h-6 w-6 rounded-full ring-1 ring-black/10 shadow-[inset_0_-2px_4px_rgba(0,0,0,.25)]" style={{ background: a.fundo }} aria-hidden />
                                <span className="text-[11px] font-semibold text-tx2">{a.rotulo}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
