"use client";

/**
 * Película antivandalismo: produto principal da JR Filmes.
 * Ilustração própria em SVG (vidro trincado preso pela película), segmentos de uso,
 * como funciona, o que faz e o que não faz, e contexto do Rio com fonte oficial (ISP-RJ).
 */
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  Car,
  Check,
  Clock3,
  ExternalLink,
  EyeOff,
  Home,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Store,
  Sun,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlataforma } from "@/lib/store";
import { brl } from "@/lib/pricing";
import type { LinhaAntivandalismo } from "@/lib/config";
import { cn } from "@/lib/utils";

/* ---------------- ilustração: vidro trincado que não cede ---------------- */

/** Gera as trincas de forma determinística a partir do ponto de impacto. */
function trincas(cx: number, cy: number) {
  const raios: string[] = [];
  const aneis: string[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (i % 3) * 0.09;
    const comp = 120 + ((i * 37) % 90);
    let x = cx;
    let y = cy;
    let d = `M${cx} ${cy}`;
    for (let k = 1; k <= 4; k++) {
      const r = (comp / 4) * k;
      const desvio = ((i * 13 + k * 7) % 11) / 60 - 0.09;
      x = cx + Math.cos(a + desvio) * r;
      y = cy + Math.sin(a + desvio) * r;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    raios.push(d);
  }
  for (const r of [26, 52, 84]) {
    let d = "";
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rr = r + ((i * 17) % 9) - 4;
      d += `${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)} `;
    }
    aneis.push(d);
  }
  return { raios, aneis };
}

export function VidroSeguro({ className = "" }: { className?: string }) {
  const { raios, aneis } = trincas(250, 205);
  return (
    <svg viewBox="0 0 520 440" className={className} role="img" aria-label="Vidro trincado por um impacto, com os cacos presos pela película antivandalismo">
      <defs>
        <linearGradient id="av-ceu" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd3ff" />
          <stop offset="1" stopColor="#2a7fc4" />
        </linearGradient>
        <linearGradient id="av-pelicula" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d4af6a" stopOpacity="0.26" />
          <stop offset="1" stopColor="#d4af6a" stopOpacity="0.1" />
        </linearGradient>
        <clipPath id="av-vao">
          <rect x="60" y="40" width="380" height="330" rx="4" />
        </clipPath>
      </defs>
      {/* caixilho */}
      <rect x="44" y="24" width="412" height="362" rx="8" fill="#0e1624" />
      <g clipPath="url(#av-vao)">
        <rect x="60" y="40" width="380" height="330" fill="url(#av-ceu)" />
        {/* morro e prédios ao fundo, vistos pelo vidro */}
        <path d="M60 300 C140 210 190 230 240 260 C300 180 360 170 440 250 V370 H60Z" fill="#1f7a55" opacity="0.75" />
        <path d="M300 250 C320 150 350 120 372 140 C392 160 396 220 410 250Z" fill="#7a5a3a" opacity="0.85" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={80 + i * 52} y={300 - (i % 3) * 22} width="36" height={80 + (i % 3) * 22} fill="#f3efe6" opacity="0.85" />
        ))}
        {/* película */}
        <rect x="60" y="40" width="380" height="330" fill="url(#av-pelicula)" />
        {/* trincas presas */}
        <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
          {raios.map((d, i) => (
            <path key={`r${i}`} d={d} strokeWidth={i % 3 === 0 ? 1.8 : 1.1} opacity="0.92" />
          ))}
          {aneis.map((d, i) => (
            <path key={`a${i}`} d={d} strokeWidth="1" opacity="0.7" />
          ))}
        </g>
        <circle cx="250" cy="205" r="7" fill="#ffffff" opacity="0.9" />
        {/* reflexo */}
        <path d="M80 60 L150 60 L90 160 L80 160Z" fill="#ffffff" opacity="0.12" />
      </g>
      {/* legendas */}
      <g fontFamily="var(--font-corpo), sans-serif" fontSize="13" fontWeight="600">
        <rect x="52" y="392" width="214" height="34" rx="3" fill="#0e1624" />
        <circle cx="70" cy="409" r="5" fill="#d4af6a" />
        <text x="84" y="414" fill="#ffffff">Cacos presos na película</text>
        <rect x="274" y="392" width="184" height="34" rx="3" fill="#ffffff" stroke="#0e1624" strokeOpacity="0.15" />
        <circle cx="292" cy="409" r="5" fill="#1f7a55" />
        <text x="306" y="414" fill="#0e1624">Vão continua fechado</text>
      </g>
    </svg>
  );
}

/* ---------------- abertura da página ---------------- */

export function HeroAntivandalismo() {
  const { config } = usePlataforma();
  const wa = useWhatsapp();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#8fd3ff]/30 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-10 bg-ouro sm:block" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ouro sm:text-[10.5px] sm:tracking-[0.34em]">Película antivandalismo · Rio de Janeiro</p>
          </div>
          <h1 className="font-serif text-[3rem] font-light leading-[0.98] tracking-[-0.015em] text-tx text-balance sm:text-[4.4rem] lg:text-[5rem]">
            O vidro trinca. <em className="italic text-ouro">Mas não abre.</em>
          </h1>
          <p className="max-w-xl text-pretty text-[15px] leading-[1.8] text-tx2 sm:text-base">
            Uma pedrada no vidro do carro parado no sinal, na vitrine da loja ou na janela de casa leva segundos. A película antivandalismo mantém os cacos colados, deixa a invasão mais lenta e barulhenta e protege quem está do lado de dentro. Aplicamos em {config.site.areaDomicilio}, na sua casa, na sua loja ou no nosso ponto de instalação.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild tamanho="lg">
              <a href={wa("Olá, JR Filmes! Quero um orçamento de película antivandalismo.")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden /> Quero um orçamento
              </a>
            </Button>
            <Button asChild tamanho="lg" variante="contorno">
              <Link href="#linhas">Ver as linhas</Link>
            </Button>
          </div>
          <SelosConfianca />
        </div>
        <VidroSeguro className="mx-auto w-full max-w-[520px] drop-shadow-[0_30px_40px_rgba(14,22,36,.25)]" />
      </div>
    </section>
  );
}

/* ---------------- para quem ---------------- */

const SEGMENTOS = [
  {
    icone: Building2,
    titulo: "Fachadas de vidro",
    risco: "Portarias, halls e prédios comerciais com grandes painéis expostos à rua.",
    ganho: "O painel atingido continua no lugar e os cacos não caem sobre quem passa.",
  },
  {
    icone: Store,
    titulo: "Lojas e vitrines",
    risco: "Vitrines de rua viram alvo de quebra-quebra e furto rápido durante a noite.",
    ganho: "Leva mais tempo e faz mais barulho para abrir passagem, o que dá tempo ao alarme e à vigilância.",
  },
  {
    icone: Home,
    titulo: "Casas e apartamentos térreos",
    risco: "Janelas baixas, portas de vidro e varandas dão acesso direto à casa.",
    ganho: "A família fica protegida dos estilhaços, e a janela atingida segura a primeira tentativa.",
  },
  {
    icone: Car,
    titulo: "Carros",
    risco: "Vidro lateral quebrado no sinal ou no estacionamento para levar celular e bolsa.",
    ganho: "O vidro trinca mas segura, e o motorista ganha os segundos que importam para sair dali.",
  },
];

export function SegmentosAntivandalismo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SEGMENTOS.map((s) => (
        <article key={s.titulo} className="flex flex-col gap-4 rounded-[3px] border border-linha/10 bg-sup p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-ouro/40">
            <s.icone className="h-5 w-5 text-ouro" strokeWidth={1.4} aria-hidden />
          </span>
          <h3 className="font-serif text-[1.7rem] font-light leading-[1.05] text-tx">{s.titulo}</h3>
          <p className="text-[14px] leading-relaxed text-tx3">{s.risco}</p>
          <p className="mt-auto border-t border-linha/10 pt-4 text-[14px] leading-relaxed text-tx2">
            <ShieldCheck className="mr-1.5 inline h-4 w-4 -translate-y-px text-ouro" aria-hidden />
            {s.ganho}
          </p>
        </article>
      ))}
    </div>
  );
}

/* ---------------- como funciona ---------------- */

const ETAPAS = [
  { titulo: "O impacto acontece", texto: "Pedra, ferramenta ou chute atingem o vidro. Sem película, ele se desfaz e abre a passagem em um golpe." },
  { titulo: "O vidro trinca", texto: "Com a película, a trinca aparece, mas os pedaços ficam colados em uma camada de poliéster com adesivo de alta aderência." },
  { titulo: "A passagem continua fechada", texto: "Para entrar, é preciso insistir, rasgar e fazer barulho. É esse tempo extra que afasta quem quer agir rápido." },
];

export function ComoFuncionaAntivandalismo() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[3px] border border-linha/10 bg-linha/10 md:grid-cols-3">
      {ETAPAS.map((e, i) => (
        <li key={e.titulo} className="flex flex-col gap-3 bg-sup p-7">
          <span className="num font-serif text-3xl italic text-ouro">{i + 1}</span>
          <h3 className="text-[15px] font-semibold uppercase tracking-[0.12em] text-tx">{e.titulo}</h3>
          <p className="text-[14.5px] leading-relaxed text-tx3">{e.texto}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- o que faz e o que não faz ---------------- */

const FAZ = [
  "Segura os cacos quando o vidro quebra",
  "Atrasa e dificulta a abertura do vão",
  "Reduz ferimentos causados por estilhaços",
  "Bloqueia até 99% dos raios UV",
  "Fica quase invisível, sem mudar a fachada",
];
const NAO_FAZ = [
  "Não é blindagem e não para tiros",
  "Não torna o vidro impossível de quebrar",
  "Não substitui alarme, grade ou vigilância",
];

export function FazNaoFaz() {
  return (
    <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-4 rounded-[3px] border border-linha/10 bg-sup p-7">
        <h3 className="font-serif text-[1.8rem] font-light text-tx">O que a película faz</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {FAZ.map((f) => (
            <li key={f} className="flex gap-2.5 text-[14.5px] leading-snug text-tx2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1f7a55]" strokeWidth={2.4} aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4 rounded-[3px] border border-linha/10 p-7">
        <h3 className="font-serif text-[1.8rem] font-light text-tx">O que ela não faz</h3>
        <ul className="grid gap-3">
          {NAO_FAZ.map((f) => (
            <li key={f} className="flex gap-2.5 text-[14.5px] leading-snug text-tx2">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-perigo" strokeWidth={2.4} aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        <p className="text-[13px] leading-relaxed text-tx4">Falamos isso antes de vender. Proteção que promete demais é a que decepciona no dia em que precisa funcionar.</p>
      </div>
    </div>
  );
}

/* ---------------- contexto do Rio ---------------- */

export function ContextoRio() {
  return (
    <section className="escuro bg-[#0e1624] text-tx2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1fr] md:py-24">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-ouro" aria-hidden />
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.34em] text-ouro">Por que no Rio</p>
          </div>
          <h2 className="font-serif text-[2.4rem] font-light leading-[1.03] text-tx text-balance sm:text-[3.2rem]">
            Quem vive no Rio sabe <em className="italic text-ouro">o que um vidro quebrado significa.</em>
          </h2>
        </div>
        <div className="flex flex-col gap-5 text-[15px] leading-[1.8]">
          <p>
            Furto com quebra de vidro no sinal, vitrine estourada de madrugada, janela forçada em casa térrea. São situações que todo carioca já viveu ou conhece alguém que viveu. A película não resolve a segurança pública, mas muda o que acontece nos segundos depois do impacto.
          </p>
          <p>
            Os números oficiais de roubos e furtos por bairro são publicados todo mês pelo Instituto de Segurança Pública do Estado do Rio de Janeiro. Use os dados da sua região para decidir onde proteger primeiro.
          </p>
          <a href="https://www.ispdados.rj.gov.br/" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ouro hover:underline">
            Ver os dados do ISP-RJ <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- destaque na home ---------------- */

export function DestaqueAntivandalismo() {
  return (
    <section className="escuro bg-[#0e1624]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-ouro" aria-hidden />
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.34em] text-ouro">Destaque · Antivandalismo</p>
          </div>
          <h2 className="font-serif text-[2.6rem] font-light leading-[1.02] text-tx text-balance sm:text-[3.6rem]">
            O vidro trinca. <em className="italic text-ouro">Mas não abre.</em>
          </h2>
          <p className="max-w-lg text-[15px] leading-[1.8] text-tx2">
            Proteção para fachadas de vidro, lojas, casas e carros. Os cacos ficam presos na película, a invasão fica lenta e barulhenta e ninguém se corta com estilhaços.
          </p>
          <ul className="flex flex-wrap gap-2">
            {["Fachadas", "Lojas", "Casas", "Carros"].map((t) => (
              <li key={t} className="rounded-full border border-linha/20 px-3.5 py-1.5 text-[12px] font-medium text-tx2">{t}</li>
            ))}
          </ul>
          <Button asChild tamanho="lg" className="w-fit">
            <Link href="/antivandalismo">
              Conhecer a proteção <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="rounded-[3px] bg-[#fbf7ef] p-4 sm:p-6">
          <VidroSeguro className="w-full" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- WhatsApp ---------------- */

/** Link do WhatsApp comercial com a mensagem já escrita. */
export function useWhatsapp() {
  const { config } = usePlataforma();
  return (texto: string) => `https://wa.me/${config.site.whatsappComercial}?text=${encodeURIComponent(texto)}`;
}

/** Botão flutuante, acima da barra inferior no celular. */
export function BotaoWhatsapp({ texto = "Olá, JR Filmes! Quero um orçamento de película antivandalismo." }: { texto?: string }) {
  const wa = useWhatsapp();
  return (
    <a
      href={wa(texto)}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+6.5rem)] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,.7)] transition-transform duration-150 ease-saida hover:scale-105 active:scale-[0.97] lg:bottom-6 lg:right-6"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}

/* ---------------- selos de confiança ---------------- */

export function SelosConfianca() {
  const { config } = usePlataforma();
  const selos = [
    { icone: BadgeCheck, texto: `Garantia de até ${config.site.garantiaAnos} anos` },
    { icone: Clock3, texto: "Orçamento no mesmo dia" },
    { icone: Home, texto: "Em domicílio ou no nosso ponto" },
    { icone: Sparkles, texto: "Aplicação sem bolhas e sem poeira" },
  ];
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-linha/10 pt-6 sm:grid-cols-4">
      {selos.map((s) => (
        <li key={s.texto} className="flex items-center gap-2.5 text-[12.5px] font-medium leading-snug text-tx">
          <s.icone className="h-4 w-4 shrink-0 text-ouro" strokeWidth={1.6} aria-hidden />
          {s.texto}
        </li>
      ))}
    </ul>
  );
}

/* ---------------- benefícios ---------------- */

const BENEFICIOS_AV = [
  { icone: ShieldCheck, titulo: "Cacos presos", texto: "O vidro trinca, mas os pedaços ficam colados na película." },
  { icone: Clock3, titulo: "Invasão mais lenta", texto: "Abrir passagem exige insistência, tempo e barulho." },
  { icone: Users, titulo: "Menos ferimentos", texto: "Ninguém se corta com estilhaços voando para dentro." },
  { icone: Sun, titulo: "Bloqueio de UV", texto: "Até 99% dos raios UV, protegendo pele, móveis e vitrine." },
  { icone: EyeOff, titulo: "Privacidade opcional", texto: "Versões fumê e espelhada para quem quer menos exposição." },
  { icone: Sparkles, titulo: "Quase invisível", texto: "A versão transparente não muda a fachada nem a vitrine." },
];

export function BeneficiosAntivandalismo() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-linha/10 bg-linha/10 md:grid-cols-3">
      {BENEFICIOS_AV.map((b) => (
        <li key={b.titulo} className="flex flex-col gap-3 bg-sup p-6">
          <b.icone className="h-6 w-6 text-ouro" strokeWidth={1.3} aria-hidden />
          <h3 className="font-serif text-[1.4rem] font-normal leading-tight text-tx">{b.titulo}</h3>
          <p className="text-[13.5px] leading-relaxed text-tx3">{b.texto}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- linhas com preço ---------------- */

const ICONE_LINHA: Record<string, typeof Car> = { carro: Car, casa: Home, loja: Store, fachada: Building2 };

function Preco({ l }: { l: LinhaAntivandalismo }) {
  const un = l.unidade === "m2" ? "/m²" : "";
  if (l.precoVista <= 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-serif text-[2rem] font-light leading-none text-tx">Sob consulta</span>
        <span className="text-[12.5px] text-tx3">Mande fotos e medidas e receba o valor no mesmo dia</span>
      </div>
    );
  }
  const parcela = l.precoCartao > 0 && l.parcelas > 0 ? l.precoCartao / l.parcelas : 0;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-tx3">À vista no PIX</span>
      <span className="num font-serif text-[2.4rem] font-light leading-none text-tx">
        {brl(l.precoVista)}
        <small className="text-base text-tx3">{un}</small>
      </span>
      {parcela > 0 && (
        <span className="num text-[13px] text-tx2">
          ou {brl(l.precoCartao)}
          {un} no cartão em até {l.parcelas}× de {brl(parcela)}
        </span>
      )}
    </div>
  );
}

export function LinhasAntivandalismo() {
  const { config } = usePlataforma();
  const wa = useWhatsapp();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {config.servicos.antivandalismo.map((l, i) => {
        const Icone = ICONE_LINHA[l.id] ?? ShieldCheck;
        return (
          <article
            key={l.id}
            className={cn(
              "relative flex flex-col gap-5 rounded-[3px] border bg-sup p-6",
              i === 0 ? "border-ouro/60 shadow-[0_24px_50px_-30px_rgba(150,110,38,.55)]" : "border-linha/10",
            )}
          >
            {i === 0 && (
              <span className="absolute -top-3 left-6 rounded-full bg-ouro px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Mais pedido</span>
            )}
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-ouro/40">
                <Icone className="h-5 w-5 text-ouro" strokeWidth={1.4} aria-hidden />
              </span>
              <div className="flex flex-col">
                <h3 className="font-serif text-[1.55rem] font-normal leading-tight text-tx">{l.nome}</h3>
                <span className="text-[12px] text-tx3">{l.uso}</span>
              </div>
            </div>
            <ul className="flex flex-col gap-2.5">
              {l.especificacoes.map((e) => (
                <li key={e} className="flex gap-2 text-[13.5px] leading-snug text-tx2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1f7a55]" strokeWidth={2.4} aria-hidden />
                  {e}
                </li>
              ))}
              <li className="flex gap-2 text-[13.5px] font-semibold leading-snug text-tx">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-ouro" aria-hidden />
                Garantia de {l.garantiaAnos} anos
              </li>
            </ul>
            <div className="mt-auto flex flex-col gap-4 border-t border-linha/10 pt-5">
              <Preco l={l} />
              <Button asChild variante={i === 0 ? "neon" : "contorno"} className="w-full">
                <a href={wa(`Olá, JR Filmes! Quero orçamento de película antivandalismo para ${l.nome.toLowerCase()} (${l.uso.toLowerCase()}).`)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden /> Quero esta proteção
                </a>
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ---------------- processo de compra ---------------- */

const PROCESSO = [
  { icone: MessageCircle, titulo: "Contato", texto: "Chame no WhatsApp ou preencha o pedido de orçamento." },
  { icone: Ruler, titulo: "Orçamento no mesmo dia", texto: "Com fotos e medidas, ou com visita técnica para fachadas." },
  { icone: CalendarClock, titulo: "Agendamento", texto: "Na sua casa, na sua loja ou no ponto de instalação, com hora marcada." },
  { icone: Wrench, titulo: "Instalação limpa", texto: "Sem bolhas, sem poeira e sem tirar o vidro do lugar." },
];

export function ProcessoCompra() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PROCESSO.map((p, i) => (
        <li key={p.titulo} className="flex flex-col gap-3 border-t-2 border-ouro pt-5">
          <div className="flex items-center gap-3">
            <span className="num font-serif text-2xl italic text-ouro">{i + 1}</span>
            <p.icone className="h-5 w-5 text-tx3" strokeWidth={1.5} aria-hidden />
          </div>
          <h3 className="text-[14px] font-semibold uppercase tracking-[0.12em] text-tx">{p.titulo}</h3>
          <p className="text-[14px] leading-relaxed text-tx3">{p.texto}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- garantia ---------------- */

export function SeloGarantia() {
  const { config } = usePlataforma();
  const wa = useWhatsapp();
  return (
    <div className="grid items-center gap-8 rounded-[3px] border border-ouro/40 bg-sup p-8 md:grid-cols-[auto_1fr_auto] md:p-10">
      <div className="grid h-28 w-28 place-items-center rounded-full border-2 border-ouro text-center">
        <div className="flex flex-col leading-none">
          <span className="num font-serif text-5xl font-light text-ouro">{config.site.garantiaAnos}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-tx">anos</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-[2rem] font-light leading-tight text-tx">Garantia por escrito</h3>
        <p className="max-w-xl text-[14.5px] leading-relaxed text-tx2">
          Cada aplicação sai com certificado de garantia. Se a película descolar ou bolhar dentro do prazo, corrigimos sem custo, conforme o certificado.
        </p>
      </div>
      <Button asChild tamanho="lg">
        <a href={wa("Olá, JR Filmes! Quero saber mais sobre a garantia da película antivandalismo.")} target="_blank" rel="noreferrer">
          Receber orçamento <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </Button>
    </div>
  );
}
