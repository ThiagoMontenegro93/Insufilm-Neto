"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, Shield, Sofa, Wallet, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export const ITENS_NAV = [
  { href: "/", rotulo: "Home", icone: Home },
  { href: "/pelicula", rotulo: "Película", icone: Shield },
  { href: "/envelopamento", rotulo: "Auto", icone: Car },
  { href: "/arquitetonico", rotulo: "Arq", icone: Sofa },
  { href: "/parceiro/dashboard", rotulo: "Parceiro", icone: Wallet },
] as const;

export function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="FilmProtect HUB, início">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-neon/40 bg-neon/10 shadow-neon">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-neon" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 2.8 4.5 5.6v6.1c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V5.6L12 2.8Z" />
          <path d="m8.6 12.1 2.4 2.4 4.5-4.6" />
        </svg>
      </span>
      {!compacto && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight text-white">FILMPROTECT HUB</span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-neon/80">{"// NEXUS"}</span>
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
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {ITENS_NAV.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-150",
                ativo(path, i.href) ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:text-white",
              )}
            >
              {i.rotulo === "Auto" ? "Envelopamento" : i.rotulo === "Arq" ? "Arquitetônico" : i.rotulo}
            </Link>
          ))}
        </nav>
        <Link
          href="/admin/creator"
          className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-neon/40 hover:text-neon sm:flex"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden />
          Creator Hub
        </Link>
        <Link href="/admin/creator" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 sm:hidden" aria-label="Creator Hub">
          <LayoutDashboard className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </header>
  );
}

/** Barra flutuante de vidro, só no celular. */
export function NavInferior() {
  const path = usePathname();
  return (
    <nav
      aria-label="Atalhos"
      className="fixed inset-x-0 bottom-0 z-50 px-4 md:hidden"
      style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom, 0px))" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between rounded-[28px] border border-white/10 bg-zinc-900/75 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,.9)] backdrop-blur-2xl">
        {ITENS_NAV.map((i) => {
          const on = ativo(path, i.href);
          const Icone = i.icone;
          return (
            <li key={i.href} className="flex-1">
              <Link
                href={i.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[22px] py-2 text-[10.5px] font-medium transition-[background-color,color] duration-200",
                  on ? "bg-neon/[0.12] text-neon" : "text-zinc-500 active:text-zinc-200",
                )}
              >
                <Icone className={cn("h-5 w-5", on && "drop-shadow-[0_0_8px_rgba(0,217,255,.8)]")} strokeWidth={on ? 2.2 : 1.8} aria-hidden />
                {i.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Rodape() {
  return (
    <footer className="border-t border-white/[0.06] pb-seguro md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-sm text-sm text-zinc-500">Plataforma de indicação e gestão para película e envelopamento. Valores em reais (R$).</p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">PROTEÇÃO INVISÍVEL. DESIGN VISÍVEL.</p>
      </div>
    </footer>
  );
}
