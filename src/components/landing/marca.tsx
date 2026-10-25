"use client";

/**
 * Seções da identidade JR Filmes: benefícios, serviços em painéis diagonais,
 * atendimento em domicílio ou em ponto de instalação, comparativo de películas e dúvidas.
 */
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  EyeOff,
  Gem,
  Home,
  MapPin,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Sun,
  Thermometer,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campo } from "@/components/ui/primitivos";
import { usePlataforma } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------------- faixa de benefícios ---------------- */

const BENEFICIOS = [
  { icone: ShieldCheck, titulo: "Segurança reforçada", texto: "Películas resistentes a impactos e tentativas de arrombamento." },
  { icone: Sun, titulo: "Proteção solar e UV", texto: "Bloqueia até 99% dos raios UV e reduz o calor interno." },
  { icone: Thermometer, titulo: "Conforto térmico", texto: "Ambiente mais fresco e menos uso do ar-condicionado." },
  { icone: EyeOff, titulo: "Privacidade", texto: "Mais discrição e tranquilidade para você e sua família." },
  { icone: Gem, titulo: "Estética premium", texto: "Valoriza o veículo, o imóvel ou o ambiente." },
  { icone: BadgeCheck, titulo: "Qualidade garantida", texto: "Materiais de alta performance e instalação profissional." },
];

export function FaixaBeneficios() {
  return (
    <section className="relative border-y border-white/[0.06] bg-gradient-to-b from-black to-zinc-950">
      <div className="linha-ouro absolute inset-x-0 top-0" aria-hidden />
      <ul className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-3 lg:grid-cols-6">
        {BENEFICIOS.map((b, i) => (
          <li
            key={b.titulo}
            className={cn(
              "flex flex-col items-center gap-3 px-3 py-8 text-center",
              "border-white/[0.07] lg:border-l lg:first:border-l-0",
              i % 2 === 1 && "border-l lg:border-l",
              i >= 2 && "border-t lg:border-t-0",
            )}
          >
            <b.icone className="h-8 w-8 text-ouro" strokeWidth={1.3} aria-hidden />
            <h3 className="text-[12.5px] font-bold uppercase leading-tight tracking-[0.12em] text-white">{b.titulo}</h3>
            <p className="max-w-[200px] text-[13px] leading-snug text-zinc-400">{b.texto}</p>
          </li>
        ))}
      </ul>
      <div className="linha-ouro absolute inset-x-0 bottom-0" aria-hidden />
    </section>
  );
}

/* ---------------- serviços em painéis diagonais ---------------- */

function ArteServico({ tipo }: { tipo: string }) {
  switch (tipo) {
    case "insulfilm":
      return (
        <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="a-ins" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2b2b2e" />
              <stop offset="1" stopColor="#050505" />
            </linearGradient>
          </defs>
          <rect width="200" height="300" fill="url(#a-ins)" />
          <path d="M-20 170 Q40 70 150 60 L230 60 L230 200 Z" fill="#0a0a0b" stroke="#6b6e74" strokeWidth="1.5" />
          <path d="M10 160 Q60 90 140 80" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M-20 220 Q80 190 230 210" stroke="#D4AF6A" strokeOpacity="0.55" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case "envelopamento":
      return (
        <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="a-env" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1c1c1f" />
              <stop offset="1" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="a-env-carro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a4c52" />
              <stop offset="0.5" stopColor="#141416" />
              <stop offset="1" stopColor="#2c2d31" />
            </linearGradient>
          </defs>
          <rect width="200" height="300" fill="url(#a-env)" />
          <path d="M-30 200 Q-20 160 20 152 L80 140 Q110 108 150 104 L210 104 Q240 108 260 138 L290 146 L290 210 L-30 210 Z" fill="url(#a-env-carro)" stroke="#8a8d93" strokeOpacity="0.5" />
          <circle cx="40" cy="210" r="26" fill="#050505" stroke="#3a3a3d" strokeWidth="4" />
          <circle cx="40" cy="210" r="10" fill="#D4AF6A" fillOpacity="0.5" />
        </svg>
      );
    case "superficies":
      return (
        <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="a-mar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d9dadc" />
              <stop offset="1" stopColor="#8d8f93" />
            </linearGradient>
          </defs>
          <rect width="200" height="300" fill="url(#a-mar)" />
          <g fill="none" stroke="#5c5d60" strokeOpacity="0.5">
            <path d="M0 40 Q60 70 90 50 T200 90" />
            <path d="M0 140 Q50 120 100 150 T200 130" strokeOpacity="0.35" />
          </g>
          <rect x="0" y="190" width="200" height="110" fill="#111" />
          <rect x="20" y="170" width="160" height="22" fill="#1a1a1a" stroke="#D4AF6A" strokeOpacity="0.4" />
        </svg>
      );
    case "residencial":
      return (
        <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
          <rect width="200" height="300" fill="#0b0d12" />
          <rect x="0" y="0" width="200" height="140" fill="#1c2233" />
          <path d="M10 120 L190 90 L190 260 L10 260 Z" fill="#0d0f14" stroke="#4b4f58" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={22 + (i % 4) * 42} y={130 + Math.floor(i / 4) * 40} width="36" height="32" fill="#f2c46d" fillOpacity={i % 3 === 0 ? 0.55 : 0.25} />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
          <rect width="200" height="300" fill="#0c0c0c" />
          <g fill="none" stroke="#D4AF6A" strokeWidth="1.3">
            <path d="M40 0 Q60 80 30 140 T70 300" />
            <path d="M150 0 Q120 90 160 160 T120 300" strokeOpacity="0.6" />
            <path d="M30 140 Q90 150 160 160" strokeOpacity="0.5" />
          </g>
        </svg>
      );
  }
}

export function ServicosDiagonais() {
  const servicos = [
    { tipo: "insulfilm", titulo: "Insulfilm automotivo", texto: "Mais segurança, conforto e privacidade para o seu veículo.", href: "#orcamento" },
    { tipo: "envelopamento", titulo: "Envelopamento automotivo", texto: "Renove o visual do carro com estilo e personalidade.", href: "/envelopamento" },
    { tipo: "superficies", titulo: "Envelopamento de superfícies", texto: "Efeito porcelanato, mármore e madeira em móveis e paredes.", href: "/arquitetonico" },
    { tipo: "residencial", titulo: "Películas residenciais e comerciais", texto: "Privacidade e proteção solar para casas, escritórios e lojas.", href: "/pelicula" },
    { tipo: "decorativo", titulo: "Revestimentos decorativos", texto: "Transforme ambientes com design e tecnologia.", href: "/arquitetonico" },
  ];
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sem-barra lg:mx-0 lg:gap-0 lg:overflow-visible lg:px-0">
      {servicos.map((s, i) => (
        <Link
          key={s.tipo}
          href={s.href}
          className={cn(
            "group relative flex h-[360px] w-[78%] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] sm:w-[46%]",
            "lg:h-[420px] lg:w-auto lg:flex-1 lg:rounded-none lg:border-0 lg:[clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]",
            i > 0 && "lg:-ml-[2.4%]",
          )}
        >
          <div className="absolute inset-0 transition-transform duration-500 ease-saida group-hover:scale-[1.04]">
            <ArteServico tipo={s.tipo} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" aria-hidden />
          <div className="relative flex flex-col gap-2 p-5 lg:px-[16%] lg:pb-7">
            <h3 className="text-[15px] font-bold uppercase leading-tight tracking-[0.12em] text-white">{s.titulo}</h3>
            <p className="text-[13px] leading-snug text-zinc-300">{s.texto}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-ouro">
              Ver mais <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 ease-saida group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-gradient-to-b from-transparent via-ouro/70 to-transparent lg:block lg:[transform:skewX(-17deg)] lg:origin-bottom" aria-hidden />
        </Link>
      ))}
    </div>
  );
}

/* ---------------- onde atendemos + pedido de orçamento ---------------- */

const PASSOS = [
  { icone: MessageCircle, titulo: "Fale com a gente", texto: "Pelo WhatsApp ou pelas calculadoras do site." },
  { icone: Ruler, titulo: "Orçamento e medição", texto: "Com fotos e medidas, ou em visita técnica." },
  { icone: CalendarClock, titulo: "Agendamento", texto: "Em domicílio ou no ponto de instalação, com hora marcada." },
  { icone: Wrench, titulo: "Instalação", texto: "Aplicação limpa, sem bolhas e sem poeira." },
  { icone: BadgeCheck, titulo: "Garantia e suporte", texto: "Certificado de garantia e acompanhamento depois." },
];

const SERVICOS_PEDIDO = ["Insulfilm automotivo", "Envelopamento automotivo", "Envelopamento de superfícies", "Películas residenciais e comerciais", "Revestimentos decorativos"];

export function AtendimentoLocal() {
  const { config } = usePlataforma();
  const { site } = config;
  const [local, setLocal] = useState<"domicilio" | "ponto">("domicilio");
  const [servico, setServico] = useState(SERVICOS_PEDIDO[0]);
  const [bairro, setBairro] = useState("");
  const [nome, setNome] = useState("");

  const mensagem = encodeURIComponent(
    `Olá, JR Filmes! Meu nome é ${nome.trim() || "(seu nome)"}.\nQuero orçamento de ${servico.toLowerCase()}.\nLocal: ${local === "domicilio" ? `em domicílio${bairro.trim() ? `, bairro ${bairro.trim()}` : ""}` : "em um ponto de instalação"}.`,
  );

  const opcoes = [
    {
      id: "domicilio" as const,
      icone: Home,
      titulo: "Em domicílio",
      texto: `Vamos até a sua casa, empresa ou garagem em ${site.areaDomicilio}. Levamos todo o equipamento e deixamos o local limpo.`,
      detalhe: "Carros, janelas, fachadas, móveis e geladeiras",
    },
    {
      id: "ponto" as const,
      icone: MapPin,
      titulo: "Em ponto de instalação",
      texto: "Você leva o carro ou a peça até um dos nossos pontos e acompanha o serviço com hora marcada.",
      detalhe: site.pontosInstalacao.length ? site.pontosInstalacao.map((p) => p.nome).join(" · ") : "Informamos o ponto mais próximo no orçamento",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 md:grid-cols-2">
        {opcoes.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setLocal(o.id)}
            aria-pressed={local === o.id}
            className={cn(
              "vidro flex flex-col gap-4 p-6 text-left transition-[border-color,box-shadow] duration-200 sm:p-8",
              local === o.id ? "border-ouro/60 shadow-neon" : "hover:border-white/20",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-ouro/40 bg-ouro/10">
                <o.icone className="h-6 w-6 text-ouro" strokeWidth={1.5} aria-hidden />
              </span>
              <span className={cn("h-4 w-4 rounded-full border-2", local === o.id ? "border-ouro bg-ouro" : "border-zinc-600")} aria-hidden />
            </div>
            <h3 className="display cromado text-2xl sm:text-3xl">{o.titulo}</h3>
            <p className="text-[15px] leading-relaxed text-zinc-300">{o.texto}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ouro/80">{o.detalhe}</p>
          </button>
        ))}
      </div>

      <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-5">
        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="flex flex-col gap-2 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <span className="num font-display text-sm font-extrabold italic text-ouro">{String(i + 1).padStart(2, "0")}</span>
              <p.icone className="h-5 w-5 text-prata" strokeWidth={1.5} aria-hidden />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-white">{p.titulo}</h4>
            <p className="text-[13px] leading-snug text-zinc-400">{p.texto}</p>
          </li>
        ))}
      </ol>

      <form
        id="orcamento"
        onSubmit={(e) => e.preventDefault()}
        className="vidro-forte grid scroll-mt-28 gap-4 p-6 sm:p-8 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <div className="flex flex-col gap-1 md:col-span-3">
          <span className="rotulo text-ouro/90">Solicite seu orçamento</span>
          <p className="text-sm text-zinc-400">
            Atendimento <strong className="text-white">{local === "domicilio" ? "em domicílio" : "em ponto de instalação"}</strong>. A mensagem já vai pronta para o WhatsApp.
          </p>
        </div>
        <Campo rotulo="Seu nome" htmlFor="orc-nome">
          <input id="orc-nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos te chamar?" />
        </Campo>
        <Campo rotulo="Serviço" htmlFor="orc-servico">
          <select id="orc-servico" className="campo" value={servico} onChange={(e) => setServico(e.target.value)}>
            {SERVICOS_PEDIDO.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Campo>
        {local === "domicilio" ? (
          <Campo rotulo="Bairro" htmlFor="orc-bairro" className="md:col-span-1">
            <input id="orc-bairro" className="campo" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Ex.: Tijuca" />
          </Campo>
        ) : (
          <div className="hidden md:block" />
        )}
        <Button asChild tamanho="lg" className="md:col-span-3">
          <a href={`https://wa.me/${site.whatsappComercial}?text=${mensagem}`} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" aria-hidden /> Pedir orçamento no WhatsApp
          </a>
        </Button>
      </form>
    </div>
  );
}

/* ---------------- comparativo de películas ---------------- */

const LINHAS = [
  { nome: "Fumê poliéster", uso: "Carro", calor: 1, nitidez: 2, durabilidade: 1, seguranca: 1 },
  { nome: "Nano carbono", uso: "Carro", calor: 3, nitidez: 3, durabilidade: 4, seguranca: 1 },
  { nome: "Nano cerâmica", uso: "Carro e imóvel", calor: 5, nitidez: 5, durabilidade: 5, seguranca: 1 },
  { nome: "Antivandalismo", uso: "Carro e imóvel", calor: 1, nitidez: 4, durabilidade: 4, seguranca: 4 },
  { nome: "Alta rigidez", uso: "Imóvel", calor: 1, nitidez: 4, durabilidade: 5, seguranca: 5 },
  { nome: "Jateada / decorativa", uso: "Imóvel", calor: 2, nitidez: 1, durabilidade: 4, seguranca: 1 },
];

function Nivel({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`${rotulo}: ${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={cn("h-1.5 w-4 -skew-x-[25deg] rounded-[1px]", n <= valor ? "bg-ouro" : "bg-white/10")} />
      ))}
    </span>
  );
}

export function ComparativoPeliculas() {
  const colunas = [
    { k: "calor" as const, t: "Redução de calor" },
    { k: "nitidez" as const, t: "Nitidez" },
    { k: "durabilidade" as const, t: "Durabilidade" },
    { k: "seguranca" as const, t: "Segurança" },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              <th className="rotulo px-5 py-4 font-semibold">Película</th>
              <th className="rotulo px-5 py-4 font-semibold">Uso</th>
              {colunas.map((c) => (
                <th key={c.k} className="rotulo px-5 py-4 font-semibold">
                  {c.t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LINHAS.map((l) => (
              <tr key={l.nome} className="border-b border-white/[0.05] last:border-0">
                <td className="px-5 py-4 font-semibold text-white">{l.nome}</td>
                <td className="px-5 py-4 text-zinc-400">{l.uso}</td>
                {colunas.map((c) => (
                  <td key={c.k} className="px-5 py-4">
                    <Nivel valor={l[c.k]} rotulo={c.t} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500">Comparativo indicativo. O desempenho exato e a garantia dependem do fabricante e da linha escolhida, e vão descritos no orçamento.</p>
    </div>
  );
}

/* ---------------- dúvidas ---------------- */

export function Perguntas() {
  const { config } = usePlataforma();
  const itens = [
    { p: "Vocês vão até a minha casa?", r: `Sim. Atendemos em domicílio em ${config.site.areaDomicilio}: casa, apartamento, empresa ou garagem. Se preferir, você leva o carro ou a peça até um ponto de instalação.` },
    { p: "Quanto tempo leva a aplicação?", r: "No carro, o insulfilm completo costuma ficar pronto no mesmo período do dia. Em imóveis e envelopamentos, o prazo depende da metragem e vem escrito no orçamento." },
    { p: "Insulfilm no carro é permitido?", r: "Sim, dentro dos limites de transparência do CONTRAN: para-brisa com no mínimo 75%, vidros laterais dianteiros com 70% e os demais com 28%. Indicamos a película certa para cada vidro." },
    { p: "Quais cuidados depois da aplicação?", r: "Nos primeiros dias a película está curando: evite baixar os vidros e limpar a superfície. Passamos o prazo exato e as instruções de limpeza na entrega." },
    { p: "Tem garantia?", r: `Sim. Os serviços têm garantia de até ${config.site.garantiaAnos} anos, conforme a linha escolhida, com certificado e suporte depois da instalação.` },
    { p: "Como funciona a indicação?", r: `Você indica pelo painel do parceiro, o cliente recebe um código e, quando o serviço fecha, você ganha ${config.taxas.indicadorPct}% do valor por PIX.` },
  ];
  return (
    <div className="flex flex-col divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07]">
      {itens.map((i) => (
        <details key={i.p} className="group px-5 py-1 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-white [&::-webkit-details-marker]:hidden">
            {i.p}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ouro/40 text-ouro transition-transform duration-200 ease-saida group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-5 text-[15px] leading-relaxed text-zinc-400">{i.r}</p>
        </details>
      ))}
    </div>
  );
}

