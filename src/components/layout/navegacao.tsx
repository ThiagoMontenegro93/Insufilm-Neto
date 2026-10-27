"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, Car, Handshake, Home, LayoutDashboard, MapPin, Shield, Sofa, Timer, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export const ITENS_NAV = [
  { href: "/", rotulo: "Home", icone: Home },
  { href: "/pelicula", rotulo: "Película", icone: Shield },
  { href: "/envelopamento", rotulo: "Auto", icone: Car },
  { href: "/arquitetonico", rotulo: "Arq", icone: Sofa },
  { href: "/parceiro/dashboard", rotulo: "Parceiro", icone: Wallet },
] as const;

/** Menu do topo: o produto principal (antivandalismo) aparece logo depois da Home. */
const ITENS_TOPO = [
  { href: "/", rotulo: "Home" },
  { href: "/antivandalismo", rotulo: "Antivandalismo" },
  { href: "/pelicula", rotulo: "Insulfilm" },
  { href: "/envelopamento", rotulo: "Envelopamento" },
  { href: "/arquitetonico", rotulo: "Superfícies" },
  { href: "/parceiro/dashboard", rotulo: "Parceiro" },
];

/** Painéis (Creator Hub, parceiro) ficam em azul-noite; a vitrine é branca. */
function ehPainel(path: string) {
  return path.startsWith("/admin") || path.startsWith("/parceiro");
}

/**
 * Marca "JR" do logotipo: letras pretas em itálico largo e a perna do R em azul royal.
 * A perna é o próprio R em azul recortado na diagonal, então acompanha a fonte em qualquer tamanho.
 */
export function MarcaJR({ className }: { className?: string }) {
  return (
    <span className={cn("display relative inline-flex leading-none tracking-[-0.07em] text-tx", className)} aria-hidden>
      J
      <span className="relative">
        R
        <span className="absolute inset-0 text-azul [clip-path:polygon(47%_57%,100%_57%,100%_100%,52%_100%)] [.escuro_&]:text-azul-claro">R</span>
      </span>
    </span>
  );
}

/** Logotipo horizontal JR FILMES para menu e rodapé. */
export function Logo({ compacto = false, sufixo }: { compacto?: boolean; sufixo?: string }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="JR Filmes, início">
      <MarcaJR className="text-[30px]" />
      {!compacto && (
        <span className="flex flex-col leading-none">
          <span className="display text-[15px] tracking-[0.01em] text-tx">FILMES</span>
          <span className="mt-1 text-[7.5px] font-semibold uppercase tracking-[0.26em] text-tx3">{sufixo ?? "Insulfilm · Envelopamento · Películas"}</span>
        </span>
      )}
    </Link>
  );
}

function ativo(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

export function NavTopo() {
  const path = usePathname();
  const painel = ehPainel(path);
  return (
    <header
      className={cn("sticky top-0 z-40 border-b", painel ? "escuro border-white/[0.06] bg-noite-fundo/90 backdrop-blur-xl" : "border-linha/[0.08] bg-white")}
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Principal">
          {ITENS_TOPO.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                "relative px-2.5 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
                ativo(path, i.href) ? "text-ouro after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:bg-ouro" : "text-tx2 hover:text-tx",
              )}
            >
              {i.rotulo}
            </Link>
          ))}
        </nav>
        <Link
          href="/admin/creator"
          className="hidden items-center gap-2 rounded-[3px] border border-linha/15 px-3 py-2 text-sm text-tx2 transition-colors hover:border-ouro/50 hover:text-ouro sm:flex"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          Creator Hub
        </Link>
        <Link href="/admin/creator" className="grid h-10 w-10 place-items-center rounded-[3px] border border-linha/15 text-tx2 sm:hidden" aria-label="Creator Hub">
          <LayoutDashboard className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </header>
  );
}

export function NavInferior() {
  const path = usePathname();
  const painel = ehPainel(path);
  return (
    <nav
      aria-label="Atalhos"
      className={cn("fixed inset-x-0 bottom-0 z-50 px-4 lg:hidden", painel && "escuro")}
      style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom, 0px))" }}
    >
      <ul
        className={cn(
          "mx-auto flex max-w-md items-stretch justify-between rounded-[24px] border p-1.5 backdrop-blur-2xl",
          painel ? "border-white/10 bg-[#0a1222]/85 shadow-[0_20px_50px_-12px_rgba(0,0,0,.9)]" : "border-linha/10 bg-white/90 shadow-[0_20px_50px_-20px_rgba(15,30,60,.45)]",
        )}
      >
        {ITENS_NAV.map((i) => {
          const on = ativo(path, i.href);
          const Icone = i.icone;
          return (
            <li key={i.href} className="flex-1">
              <Link
                href={i.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[18px] py-2 text-[10.5px] font-medium transition-[background-color,color] duration-200",
                  on ? "bg-ouro/[0.1] text-ouro" : "text-tx3 active:text-tx",
                )}
              >
                <Icone className="h-5 w-5" strokeWidth={on ? 2.2 : 1.8} aria-hidden />
                {i.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Diferenciais da faixa final da arte JR Filmes. */
const DIFERENCIAIS = [
  { rotulo: "Atendimento personalizado", icone: Handshake },
  { rotulo: "Materiais de alta qualidade", icone: BadgeCheck },
  { rotulo: "Agilidade na entrega", icone: Timer },
  { rotulo: "Atendemos Rio de Janeiro e região", icone: MapPin },
];

/** Mosaico diagonal de fotos dos serviços, como na faixa inferior da arte. */
const MOSAICO = [
  { src: "/img/jr-envelopamento.webp", alt: "Carro esportivo envelopado em grafite fosco" },
  { src: "/img/jr-casa-piscina.webp", alt: "Casa moderna com fachada de vidro e piscina" },
  { src: "/img/jr-superficies.webp", alt: "Cozinha com ilha revestida em mármore" },
  { src: "/img/jr-comercial.webp", alt: "Prédio comercial com fachada de vidro e película" },
];

export function Rodape() {
  return (
    <footer className="escuro relative overflow-hidden bg-gradient-to-r from-[#05080f] via-[#0a1630] to-[#0d2a63] pb-seguro lg:pb-0">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.8fr_1.5fr_1.4fr]">
        <div className="flex items-center px-6 py-10 lg:px-10">
          <p className="font-script text-[2.6rem] leading-[1.05] text-white -rotate-6 sm:text-5xl">
            Seu ambiente
            <br /> do seu jeito!
            <span className="mt-2 block h-1 w-40 -skew-x-[30deg] rounded-full bg-gradient-to-r from-azul to-azul-claro" aria-hidden />
          </p>
        </div>
        <ul className="hidden h-full min-h-[220px] lg:flex" aria-label="Nossos trabalhos">
          {MOSAICO.map((m) => (
            <li key={m.src} className="relative -ml-6 flex-1 overflow-hidden first:ml-0 [clip-path:polygon(18%_0,100%_0,82%_100%,0_100%)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </li>
          ))}
        </ul>
        <div className="flex flex-col justify-center gap-7 px-6 py-10 lg:px-10">
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {DIFERENCIAIS.map((d) => (
              <li key={d.rotulo} className="flex flex-col items-center gap-2.5 text-center">
                <d.icone className="h-8 w-8 text-azul-claro" strokeWidth={1.3} aria-hidden />
                <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-white">{d.rotulo}</span>
              </li>
            ))}
          </ul>
          <div className="h-px bg-gradient-to-r from-transparent via-azul-claro/60 to-transparent" aria-hidden />
          <p className="text-center text-[11px] font-semibold uppercase leading-relaxed tracking-[0.3em] text-white/90 sm:text-[13px]">
            JR Filmes <span className="text-azul-claro">|</span> Soluções em películas
            <br className="hidden sm:block" /> e envelopamento de alto padrão
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Logo />
            <Link href="/pelicula" className="text-[11px] font-bold uppercase tracking-[0.18em] text-azul-claro hover:text-white">
              Solicite seu orçamento →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
