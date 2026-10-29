"use client";

/**
 * Seções da identidade JR Filmes: benefícios, serviços em grade editorial com fotos,
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
  { icone: ShieldCheck, titulo: "Segurança reforçada", texto: "Resistência a impactos e tentativas de arrombamento." },
  { icone: Sun, titulo: "Proteção solar e UV", texto: "Bloqueia até 99% dos raios UV e reduz o calor." },
  { icone: Thermometer, titulo: "Conforto térmico", texto: "Ambiente mais fresco e menos ar-condicionado." },
  { icone: EyeOff, titulo: "Privacidade", texto: "Discrição para você e sua família." },
  { icone: Gem, titulo: "Estética premium", texto: "Valoriza o veículo, o imóvel ou o ambiente." },
  { icone: BadgeCheck, titulo: "Qualidade garantida", texto: "Materiais de alta performance e instalação profissional." },
];

export function FaixaBeneficios() {
  return (
    <section className="border-b border-linha/[0.06]">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-8">
        {BENEFICIOS.map((b) => (
          <li key={b.titulo} className="flex flex-col gap-3 pr-4">
            <b.icone className="h-5 w-5 text-ouro" strokeWidth={1.2} aria-hidden />
            <h3 className="font-sans tracking-[-0.02em] text-[1.04rem] font-semibold leading-tight text-tx">{b.titulo}</h3>
            <p className="text-[13px] leading-relaxed text-tx4">{b.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- serviços em grade editorial com fotos ---------------- */

const SERVICOS = [
  {
    id: "insulfilm",
    titulo: "Insulfilm automotivo",
    texto: "Mais segurança, conforto e privacidade, dentro das regras do CONTRAN.",
    href: "#orcamento",
    foto: "/img/rio-insulfilm.webp",
    alt: "Ilustração de técnico aplicando insulfilm em sedã preto no Aterro do Flamengo, com o Pão de Açúcar ao fundo",
    posicao: "object-center",
    grade: "lg:col-span-7 lg:row-span-2",
  },
  {
    id: "envelopamento",
    titulo: "Envelopamento automotivo",
    texto: "Fosco, brilho ou cromado. Visual novo sem tocar na pintura original.",
    href: "/envelopamento",
    foto: "/img/envelopamento.webp",
    alt: "Aplicador envelopando um carro esportivo em prata fosco dentro da oficina",
    posicao: "object-center",
    grade: "lg:col-span-5",
  },
  {
    id: "residencial",
    titulo: "Películas residenciais e comerciais",
    texto: "Proteção solar e privacidade para casas, escritórios e lojas.",
    href: "/pelicula",
    foto: "/img/fachada.webp",
    alt: "Fachada envidraçada de concessionária ao anoitecer, com carros expostos",
    posicao: "object-center",
    grade: "lg:col-span-5",
  },
  {
    id: "superficies",
    titulo: "Envelopamento de superfícies",
    texto: "Efeito mármore, madeira e porcelanato em móveis, paredes e balcões.",
    href: "/arquitetonico",
    foto: "/img/lounge-marmore.webp",
    alt: "Lounge de concessionária com parede e balcão revestidos em efeito mármore",
    posicao: "object-[50%_35%]",
    grade: "lg:col-span-5",
  },
  {
    id: "decorativo",
    titulo: "Revestimentos decorativos",
    texto: "Ambientes transformados com design e tecnologia, sem obra.",
    href: "/arquitetonico",
    foto: "/img/revestimento.webp",
    alt: "Aplicador com luvas alisando revestimento em efeito nogueira com frisos dourados na sala de entrega de uma concessionária",
    posicao: "object-[50%_45%]",
    grade: "lg:col-span-7",
  },
];

export function ServicosDiagonais() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[300px] lg:grid-cols-12">
      {SERVICOS.map((s, i) => (
        <Link
          key={s.id}
          href={s.href}
          className={cn(
            "group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[3px] bg-zinc-950 lg:min-h-0",
            i === 0 && "sm:col-span-2 sm:min-h-[460px] lg:min-h-0",
            s.grade,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.foto}
            alt={s.alt}
            loading="lazy"
            className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-saida group-hover:scale-[1.03]", s.posicao)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" aria-hidden />
          <div className="relative flex flex-col gap-2 p-6 sm:p-8">
            <span className="num text-[10.5px] font-medium tracking-[0.3em] text-ouro-soft">{String(i + 1).padStart(2, "0")}</span>
            <h3 className={cn("font-sans tracking-[-0.02em] font-bold leading-[1.05] text-white", i === 0 ? "text-[1.76rem] sm:text-[2.24rem]" : "text-[1.4rem]")}>{s.titulo}</h3>
            <p className="max-w-sm text-[13.5px] leading-relaxed text-zinc-300">{s.texto}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.24em] text-ouro">
              Conhecer <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 ease-saida group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------------- padrão concessionária ---------------- */

export function PadraoConcessionaria() {
  const numeros = [
    { valor: "99%", rotulo: "de bloqueio UV" },
    { valor: "0", rotulo: "bolhas ou poeira aceitas" },
    { valor: "5 anos", rotulo: "de garantia" },
  ];
  return (
    <section className="escuro relative isolate overflow-hidden bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/detalhe-aplicacao.webp"
        alt="Mão com luva aplicando película com espátula em vidro de carro, em close"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-black via-black/85 to-black/30" aria-hidden />
      <div className="mx-auto flex max-w-7xl justify-end px-4 py-24 sm:px-6 md:py-36">
        <div className="flex max-w-xl flex-col gap-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-ouro" aria-hidden />
            <p className="text-[10.5px] font-medium uppercase tracking-[0.38em] text-ouro-soft">Padrão concessionária</p>
          </div>
          <h2 className="font-sans tracking-[-0.02em] text-[2.08rem] font-bold leading-[1.02] text-white text-balance sm:text-[2.88rem]">
            O mesmo cuidado do showroom, <em className="not-italic text-ouro-soft">onde você estiver.</em>
          </h2>
          <p className="text-[15px] leading-[1.8] text-zinc-300">
            Montamos uma área limpa e iluminada na sua garagem ou recebemos você no ponto de instalação. Corte sob medida, bordas seladas e conferência peça por peça antes da entrega.
          </p>
          <dl className="grid grid-cols-3 border-t border-white/15 pt-6">
            {numeros.map((n, i) => (
              <div key={n.rotulo} className={cn("flex flex-col gap-1", i > 0 && "border-l border-white/10 pl-4 sm:pl-6")}>
                <dt className="order-2 text-[11px] leading-snug text-zinc-500">{n.rotulo}</dt>
                <dd className="num font-sans tracking-[-0.02em] text-[1.52rem] font-bold text-white sm:text-[1.92rem]">{n.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
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

const SERVICOS_PEDIDO = ["Película antivandalismo", "Insulfilm automotivo", "Envelopamento automotivo", "Envelopamento de superfícies", "Películas residenciais e comerciais", "Revestimentos decorativos"];

export function AtendimentoLocal({ servicoInicial = SERVICOS_PEDIDO[0] }: { servicoInicial?: string }) {
  const { config } = usePlataforma();
  const { site } = config;
  const [local, setLocal] = useState<"domicilio" | "ponto">("domicilio");
  const [servico, setServico] = useState(servicoInicial);
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
              "flex flex-col gap-4 rounded-[3px] border bg-sup/60 p-6 text-left transition-[border-color,background-color] duration-200 sm:p-8",
              local === o.id ? "border-ouro/60 bg-ouro/[0.04]" : "border-linha/10 hover:border-linha/25",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-ouro/40">
                <o.icone className="h-5 w-5 text-ouro" strokeWidth={1.3} aria-hidden />
              </span>
              <span className={cn("h-4 w-4 rounded-full border-2", local === o.id ? "border-ouro bg-ouro" : "border-linha/30")} aria-hidden />
            </div>
            <h3 className="font-sans tracking-[-0.02em] text-[1.6rem] font-bold leading-none text-tx">{o.titulo}</h3>
            <p className="text-[15px] leading-relaxed text-tx2">{o.texto}</p>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-ouro/80">{o.detalhe}</p>
          </button>
        ))}
      </div>

      <ol className="grid gap-px overflow-hidden rounded-[3px] border border-linha/[0.07] bg-linha/[0.07] sm:grid-cols-2 lg:grid-cols-5">
        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="flex flex-col gap-2 bg-sup p-6">
            <div className="flex items-center gap-3">
              <span className="num font-sans tracking-[-0.02em] text-lg italic text-ouro">{String(i + 1).padStart(2, "0")}</span>
              <p.icone className="h-5 w-5 text-prata" strokeWidth={1.5} aria-hidden />
            </div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-tx">{p.titulo}</h4>
            <p className="text-[13px] leading-snug text-tx3">{p.texto}</p>
          </li>
        ))}
      </ol>

      <form
        id="orcamento"
        onSubmit={(e) => e.preventDefault()}
        className="grid scroll-mt-28 grid-cols-1 gap-4 rounded-[3px] border border-linha/10 bg-sup p-6 sm:p-8 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <div className="flex flex-col gap-1 md:col-span-3">
          <span className="rotulo text-ouro/90">Solicite seu orçamento</span>
          <p className="text-sm text-tx3">
            Atendimento <strong className="text-tx">{local === "domicilio" ? "em domicílio" : "em ponto de instalação"}</strong>. A mensagem já vai pronta para o WhatsApp.
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
        <span key={n} className={cn("h-1.5 w-4 -skew-x-[25deg] rounded-[1px]", n <= valor ? "bg-ouro" : "bg-linha/10")} />
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
      <div className="overflow-x-auto rounded-[3px] border border-linha/[0.07]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-linha/[0.07] bg-linha/[0.02]">
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
              <tr key={l.nome} className="border-b border-linha/[0.05] last:border-0">
                <td className="px-5 py-4 font-semibold text-tx">{l.nome}</td>
                <td className="px-5 py-4 text-tx3">{l.uso}</td>
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
      <p className="text-xs text-tx4">Comparativo indicativo. O desempenho exato e a garantia dependem do fabricante e da linha escolhida, e vão descritos no orçamento.</p>
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
  return <ListaPerguntas itens={itens} />;
}

export function ListaPerguntas({ itens }: { itens: { p: string; r: string }[] }) {
  return (
    <div className="flex flex-col divide-y divide-linha/[0.07] rounded-[3px] border border-linha/[0.07]">
      {itens.map((i) => (
        <details key={i.p} className="group px-5 py-1 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-tx [&::-webkit-details-marker]:hidden">
            {i.p}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ouro/40 text-ouro transition-transform duration-200 ease-saida group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-5 text-[15px] leading-relaxed text-tx3">{i.r}</p>
        </details>
      ))}
    </div>
  );
}

