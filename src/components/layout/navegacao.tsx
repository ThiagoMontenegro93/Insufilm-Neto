"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Car, ChevronRight, Gem, Home, LayoutDashboard, Shield, Sofa, Store, Wallet } from "lucide-react";
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

/** Logotipo JR FILMES em metal escovado com o corte dourado da perna do R. */
export function Logo({ compacto = false, sufixo, claro = false }: { compacto?: boolean; sufixo?: string; claro?: boolean }) {
  const metal = claro ? "tinta" : "cromado";
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="JR Filmes, início">
      <span className="relative flex items-baseline" aria-hidden>
        <span className={cn("display text-[26px] leading-none tracking-[-0.06em]", metal)}>JR</span>
        <span className="absolute -right-1 bottom-[3px] h-[3px] w-4 -skew-x-[30deg] bg-gradient-to-r from-ouro-soft to-ouro-deep" />
      </span>
      {!compacto && (
        <span className="flex flex-col leading-none">
          <span className={cn("display text-[15px] tracking-[0.02em]", metal)}>FILMES</span>
          <span className={cn("mt-1 text-[8.5px] font-semibold uppercase tracking-[0.32em]", claro ? "text-[#966e26]" : "text-ouro/80")}>{sufixo ?? "Insulfilm · Envelopamento"}</span>
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
  // a vitrine (home) é clara e solar; as demais telas seguem no preto da marca
  const claro = path === "/";
  return (
    <header
      className={cn("sticky top-0 z-40 border-b backdrop-blur-xl", claro ? "border-[#0e1624]/[0.08] bg-[#f4fafc]" : "border-white/[0.06] bg-black/75")}
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo claro={claro} />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Principal">
          {ITENS_TOPO.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                "relative px-2.5 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
                ativo(path, i.href)
                  ? cn("after:absolute after:inset-x-3 after:-bottom-[13px] after:h-px", claro ? "text-[#966e26] after:bg-[#966e26]" : "text-ouro after:bg-ouro")
                  : claro
                    ? "text-[#3a4456] hover:text-[#0e1624]"
                    : "text-zinc-400 hover:text-white",
              )}
            >
              {i.rotulo}
            </Link>
          ))}
        </nav>
        <Link
          href="/admin/creator"
          className={cn(
            "hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors sm:flex",
            claro ? "border-[#0e1624]/15 text-[#3a4456] hover:border-[#966e26]/50 hover:text-[#966e26]" : "border-white/10 text-zinc-300 hover:border-neon/40 hover:text-neon",
          )}
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          Creator Hub
        </Link>
        <Link href="/admin/creator" className={cn("grid h-10 w-10 place-items-center rounded-xl border sm:hidden", claro ? "border-[#0e1624]/15 text-[#3a4456]" : "border-white/10 text-zinc-300")} aria-label="Creator Hub">
          <LayoutDashboard className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </header>
  );
}

/** Barra flutuante de vidro, só no celular. */
export function NavInferior() {
  const path = usePathname();
  const claro = path === "/";
  return (
    <nav
      aria-label="Atalhos"
      className="fixed inset-x-0 bottom-0 z-50 px-4 lg:hidden"
      style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom, 0px))" }}
    >
      <ul
        className={cn(
          "mx-auto flex max-w-md items-stretch justify-between rounded-[24px] border p-1.5 backdrop-blur-2xl",
          claro ? "border-[#0e1624]/10 bg-white/90 shadow-[0_20px_50px_-20px_rgba(14,22,36,.45)]" : "border-white/10 bg-zinc-950/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,.9)]",
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
                  on
                    ? claro
                      ? "bg-[#f5b301]/[0.14] text-[#966e26]"
                      : "bg-neon/[0.12] text-neon"
                    : claro
                      ? "text-[#58627a] active:text-[#0e1624]"
                      : "text-zinc-500 active:text-zinc-200",
                )}
              >
                <Icone className={cn("h-5 w-5", on && !claro && "drop-shadow-[0_0_8px_rgba(212,175,106,.8)]")} strokeWidth={on ? 2.2 : 1.8} aria-hidden />
                {i.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const SEGMENTOS = [
  { rotulo: "Carros", icone: Car },
  { rotulo: "Residências", icone: Home },
  { rotulo: "Comércios", icone: Store },
  { rotulo: "Escritórios", icone: Building2 },
  { rotulo: "Proteção e segurança", icone: Shield },
  { rotulo: "Acabamento premium", icone: Gem },
];

export function Rodape() {
  return (
    <footer className="relative border-t border-white/[0.06] pb-seguro lg:pb-10">
      <div className="linha-ouro absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-12 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-script text-4xl leading-none text-ouro sm:text-5xl">
            Seu estilo,
            <br className="sm:hidden" /> nossa expertise.
          </p>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-6 lg:gap-x-8">
            {SEGMENTOS.map((s) => (
              <li key={s.rotulo} className="flex flex-col items-center gap-2 text-center">
                <s.icone className="h-6 w-6 text-prata" strokeWidth={1.4} aria-hidden />
                <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-zinc-400">{s.rotulo}</span>
              </li>
            ))}
          </ul>
          <Link href="/pelicula" className="group inline-flex items-center gap-2 self-start text-sm font-bold uppercase tracking-[0.16em] text-white lg:self-auto">
            Solicite seu orçamento
            <ChevronRight className="h-5 w-5 text-ouro transition-transform duration-150 ease-saida group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
        <div className="flex flex-col items-start gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.34em] text-zinc-500">JR Filmes | Transformando superfícies em experiências</p>
        </div>
      </div>
    </footer>
  );
}
