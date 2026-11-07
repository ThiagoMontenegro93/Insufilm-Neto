"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, EyeOff, Gem, Handshake, Home, LayoutDashboard, Shield, ShieldCheck, Sofa, Thermometer, Wallet } from "lucide-react";
import { usePlataforma } from "@/lib/store";
import { BlocoContatos } from "@/components/ui/contatos";
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
 * Logotipo Aplik Films recortado das artes oficiais (A vermelho + "plik" e "FILMS" cromados).
 * O fundo do arquivo é transparente; funciona sobre o preto da vitrine e dos painéis.
 */
export function MarcaAplik({ className, prioridade = false }: { className?: string; prioridade?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/img/aplik-logo.webp"
      alt="Aplik Films"
      width={582}
      height={215}
      className={cn("h-auto select-none", className)}
      fetchPriority={prioridade ? "high" : undefined}
      draggable={false}
    />
  );
}

/** Logotipo horizontal para menu e rodapé. */
export function Logo({ compacto = false, sufixo }: { compacto?: boolean; sufixo?: string }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Aplik Films, início">
      <MarcaAplik className="w-[104px]" />
      {!compacto && (
        <span className="hidden border-l border-ouro/50 pl-3 text-[7.5px] font-semibold uppercase leading-[1.5] tracking-[0.24em] text-tx3 sm:block">
          {sufixo ?? (
            <>
              Soluções em películas
              <br /> e envelopamento
            </>
          )}
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
      className={cn("sticky top-0 z-40 border-b", painel ? "escuro border-white/[0.06] bg-noite-fundo/90 backdrop-blur-xl" : "border-ouro/30 bg-[#070708]/95 backdrop-blur-xl")}
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
          painel ? "border-white/10 bg-[#111113]/85 shadow-[0_20px_50px_-12px_rgba(0,0,0,.9)]" : "border-white/10 bg-[#111113]/90 shadow-[0_20px_50px_-12px_rgba(0,0,0,.9)]",
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

/** Faixa de benefícios das artes Aplik Films. */
const DIFERENCIAIS = [
  { rotulo: "Segurança", icone: ShieldCheck },
  { rotulo: "Conforto térmico", icone: Thermometer },
  { rotulo: "Privacidade", icone: EyeOff },
  { rotulo: "Valorização do seu patrimônio", icone: Gem },
  { rotulo: "Atendimento especializado", icone: Handshake },
];

export function FaixaBeneficios({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-ouro/40 bg-ouro/25 shadow-[0_0_40px_-18px_rgba(225,9,20,.9)] sm:grid-cols-5", className)}>
      {DIFERENCIAIS.map((d, i) => (
        <li key={d.rotulo} className={cn("flex flex-col items-center justify-center gap-2 bg-[#0c0c0e] px-3 py-5 text-center", i === 4 && "col-span-2 sm:col-span-1")}>
          <d.icone className="h-8 w-8 text-white" strokeWidth={1.4} aria-hidden />
          <span className="text-[10.5px] font-bold uppercase leading-tight tracking-[0.06em] text-white">{d.rotulo}</span>
        </li>
      ))}
    </ul>
  );
}

/** Rodapé no formato do fecho das artes: benefícios, "Solicite seu orçamento!" e os contatos oficiais. */
export function Rodape() {
  const { site } = usePlataforma().config;
  return (
    <footer className="escuro relative overflow-hidden border-t border-ouro/40 bg-[#070708] pb-seguro lg:pb-0">
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-[46rem] -rotate-12 bg-gradient-to-r from-[#e10914]/45 via-[#e10914]/10 to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-0 h-full w-40 -skew-x-[24deg] bg-gradient-to-b from-[#e10914]/40 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16">
        <FaixaBeneficios />
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1px_1fr_auto]">
          <Link
            href="/#orcamento"
            className="w-fit -skew-x-[10deg] rounded-[6px] bg-gradient-to-b from-[#f0262f] to-[#a3070e] px-7 py-5 shadow-[0_18px_40px_-16px_rgba(225,9,20,.95)] transition-[filter] hover:brightness-110"
          >
            <span className="block skew-x-[10deg] font-sans text-[1.7rem] font-extrabold uppercase italic leading-[0.95] text-white sm:text-[2.1rem]">
              Solicite seu
              <br /> orçamento!
            </span>
          </Link>
          <span className="hidden h-full w-px bg-gradient-to-b from-transparent via-ouro to-transparent lg:block" aria-hidden />
          <BlocoContatos />
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <MarcaAplik className="w-48" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-tx3 lg:text-right">
              Atendimento a domicílio
              <br /> {site.areaDomicilio}
            </p>
          </div>
        </div>
        <p className="border-t border-white/[0.06] pt-6 text-[11px] text-tx4">
          © {new Date().getFullYear()} {site.nome} · {site.slogan}
        </p>
      </div>
    </footer>
  );
}
