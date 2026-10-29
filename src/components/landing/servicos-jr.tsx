import Link from "next/link";
import { ArrowUpRight, Car, Eye, Hammer, Home, Shield, ShieldCheck, Sparkles, Sun, Thermometer, Zap } from "lucide-react";
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
    texto: "Mais segurança, conforto térmico e proteção contra raios UV. Películas de alta performance e resistência.",
    href: "/pelicula",
    foto: "/img/jr-insulfilm.webp",
    alt: "Vidros laterais de um carro preto com insulfilm refletindo prédios",
    selos: [
      { icone: Sun, rotulo: "Anti-irradiação UV 99%" },
      { icone: Thermometer, rotulo: "Reduz o calor interno" },
      { icone: Eye, rotulo: "Mais privacidade" },
    ],
  },
  {
    id: "envelopamento",
    icone: Car,
    titulo: "Envelopamento",
    destaque: "automotivo",
    texto: "Transforme o visual do seu veículo com estilo e personalidade. Diversas cores, texturas e acabamentos.",
    href: "/envelopamento",
    foto: "/img/jr-envelopamento.webp",
    alt: "Carro esportivo envelopado em grafite fosco em estúdio claro",
    amostras: ACABAMENTOS_AUTO,
  },
  {
    id: "residencial",
    icone: Home,
    titulo: "Películas",
    destaque: "residenciais e comerciais",
    texto: "Conforto térmico, privacidade e proteção solar para casas, apartamentos, escritórios, lojas e muito mais.",
    href: "/arquitetonico",
    foto: "/img/jr-comercial.webp",
    alt: "Prédio comercial com fachada de vidro refletindo palmeiras",
    selos: [
      { icone: Thermometer, rotulo: "Conforto térmico" },
      { icone: Eye, rotulo: "Privacidade" },
      { icone: Sparkles, rotulo: "Decoração e design" },
    ],
  },
  {
    id: "superficies",
    icone: Sparkles,
    titulo: "Envelopamento",
    destaque: "de superfícies",
    texto: "Parece mármore, porcelanato, madeira e muito mais. Renove e valorize seus ambientes com sofisticação e praticidade.",
    href: "/arquitetonico",
    foto: "/img/jr-superficies.webp",
    alt: "Cozinha com ilha em mármore branco e armários de madeira",
    amostras: ACABAMENTOS_SUPERFICIE,
  },
  {
    id: "seguranca",
    icone: ShieldCheck,
    titulo: "Película",
    destaque: "de segurança",
    texto: "Mais resistência contra impactos, prevenção de arrombamentos e proteção para vidros de veículos, residências e comércios.",
    href: "/antivandalismo",
    foto: "/img/jr-seguranca.webp",
    alt: "Vidro de carro trincado após impacto, preso pela película de segurança",
    selos: [
      { icone: Hammer, rotulo: "Resiste a impactos" },
      { icone: Zap, rotulo: "Evita estilhaços" },
      { icone: Shield, rotulo: "Mais segurança" },
    ],
  },
];

/**
 * Os cinco serviços da arte JR Filmes: foto com corte diagonal, título em caixa alta,
 * texto curto e, embaixo, os selos de benefício ou as amostras de acabamento.
 */
export function ServicosJR() {
  return (
    <section id="servicos" className="scroll-mt-20 bg-[#f4f6f9]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-16 sm:px-6 md:py-24">
        <Titulo
          className="mx-auto items-center text-center"
          eyebrow="Nossos serviços"
          titulo={<>Do carro <em>à sua casa.</em></>}
          descricao="Insulfilm, envelopamento e películas para veículos, residências, comércios e escritórios, com acabamento de alto padrão."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {SERVICOS.map((s, i) => (
            <li key={s.id} className={i === 0 ? "" : "lg:-ml-px"}>
              <Link
                href={s.href}
                className="group flex h-full flex-col overflow-hidden rounded-[3px] bg-white shadow-[0_24px_48px_-36px_rgba(15,30,60,.5)] ring-1 ring-linha/[0.06] transition-shadow duration-200 hover:shadow-[0_30px_60px_-30px_rgba(26,95,216,.45)] lg:rounded-none"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0a1222] lg:[clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.foto} alt={s.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 ease-saida group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5 lg:px-6">
                  <h3 className="flex items-start gap-3 text-[15px] font-bold uppercase leading-[1.15] tracking-[0.02em] text-tx">
                    <s.icone className="mt-0.5 h-7 w-7 shrink-0 text-ouro" strokeWidth={1.6} aria-hidden />
                    <span>
                      {s.titulo}
                      {s.destaque && <span className={i === 2 ? "block text-ouro" : "block"}>{s.destaque}</span>}
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
