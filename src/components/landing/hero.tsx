"use client";

import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarcaJR } from "@/components/layout/navegacao";
import { usePlataforma } from "@/lib/store";

/** Filete diagonal azul que separa as faixas, no lugar das ondas do calçadão. */
export function Divisor({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-1.5 w-full overflow-hidden bg-linha/[0.04] ${className}`}>
      <span className="absolute inset-y-0 left-1/2 w-[38%] -translate-x-1/2 -skew-x-[30deg] bg-gradient-to-r from-azul-escuro via-azul to-azul-claro" />
    </div>
  );
}

/** Ícone "UV" da arte: sol com as letras no centro. */
function IconeUV({ className = "" }: { className?: string }) {
  return (
    <span className={`relative grid place-items-center ${className}`} aria-hidden>
      <Sun className="h-full w-full" strokeWidth={1.4} />
      <span className="absolute text-[7px] font-extrabold tracking-tight">UV</span>
    </span>
  );
}

const PROTECOES = [
  { icone: ShieldCheck, texto: "Películas resistentes" },
  { icone: Sun, texto: "Controle térmico" },
  { icone: Lock, texto: "Privacidade" },
  { icone: null, texto: "Proteção UV até 99%" },
];

function ListaProtecoes({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <p className="text-[13px] font-medium uppercase leading-snug tracking-[0.18em] text-tx">
        Mais <span className="font-bold text-ouro">segurança</span> para você, sua família e seu patrimônio.
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1">
        {PROTECOES.map((p) => (
          <li key={p.texto} className="flex items-center gap-3 text-[11px] font-semibold uppercase leading-tight tracking-[0.1em] text-tx2">
            {p.icone ? <p.icone className="h-7 w-7 shrink-0 text-ouro" strokeWidth={1.4} aria-hidden /> : <IconeUV className="h-7 w-7 shrink-0 text-ouro" />}
            {p.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Abertura no conceito da arte JR Filmes: carro na orla à esquerda, o logotipo no centro,
 * a casa com piscina à direita e a coluna de proteções. As fotos têm cortes diagonais como na arte.
 */
export function Hero() {
  const { config } = usePlataforma();
  const { site } = config;
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:min-h-[600px] lg:flex-row">
        {/* carro */}
        <figure className="relative order-2 h-64 sm:h-80 lg:order-1 lg:h-auto lg:w-[30%] lg:[clip-path:polygon(0_0,100%_0,84%_100%,0_100%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/jr-carro-rio.webp"
            alt="Sedã preto com vidros escurecidos na orla do Rio, com o Pão de Açúcar ao fundo"
            className="absolute inset-0 h-full w-full object-cover object-[60%_60%]"
            fetchPriority="high"
          />
        </figure>

        {/* logotipo e chamadas */}
        <div className="order-1 flex flex-col items-center justify-center gap-6 px-4 py-12 text-center sm:px-6 lg:order-2 lg:w-[36%] lg:py-16">
          <h1 className="flex flex-col items-center gap-1">
            <span className="sr-only">JR Filmes: insulfilm, envelopamento e películas no Rio de Janeiro</span>
            <MarcaJR className="text-[6.5rem] sm:text-[8.5rem]" />
            <span className="display -mt-5 text-[2.9rem] leading-none tracking-[-0.01em] text-tx sm:text-[3.6rem]" aria-hidden>
              FILMES
            </span>
          </h1>
          <div className="flex w-full max-w-md flex-col items-center gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-tx sm:text-[12.5px]">
              Insulfilm <span className="text-ouro">•</span> Envelopamento <span className="text-ouro">•</span> Películas
            </p>
            <span className="h-px w-full bg-gradient-to-r from-transparent via-ouro to-transparent" aria-hidden />
            <p className="text-[10.5px] font-medium uppercase tracking-[0.26em] text-tx2 sm:text-[11.5px]">Proteção • Conforto • Estilo • Valorização</p>
          </div>
          <p className="max-w-sm text-pretty text-[14.5px] leading-relaxed text-tx3">
            Do carro à fachada, com acabamento de alto padrão. Vamos até você em {site.areaDomicilio} ou você nos encontra em um ponto de instalação.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild tamanho="lg">
              <Link href="#orcamento">
                Solicitar orçamento <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild tamanho="lg" variante="contorno">
              <Link href="/pelicula">Simular preço</Link>
            </Button>
          </div>
        </div>

        {/* casa */}
        <figure className="relative order-3 hidden lg:block lg:w-[22%] lg:[clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/jr-casa-piscina.webp"
            alt="Casa moderna com grandes vidros e piscina, com a baía de Guanabara ao fundo"
            className="absolute inset-0 h-full w-full object-cover object-[62%_50%]"
          />
        </figure>

        {/* proteções */}
        <div className="order-4 flex items-center border-linha/10 px-4 py-10 sm:px-6 lg:w-[12%] lg:min-w-[220px] lg:border-l-2 lg:border-l-ouro/70 lg:px-6 lg:py-0">
          <ListaProtecoes />
        </div>
      </div>
      <Divisor />
    </section>
  );
}
