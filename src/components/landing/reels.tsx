"use client";

/**
 * "GIFs" de processo: 5 quadros de 1 s cada (5 s no total), em loop.
 * Feito em SVG + Framer Motion para ficar nítido, leve e com preços vindos do Creator Hub.
 * Pausa fora da tela e, com movimento reduzido, vira um passo a passo manual.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlataforma } from "@/lib/store";
import type { PlatformConfig } from "@/lib/config";
import { brl, calcularSplit, precoEnvelopamento, precoLinhas } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface Quadro {
  etiqueta: string;
  titulo: string;
  detalhe: string;
}

type Cena = (i: number) => React.ReactNode;

const DURACAO_MS = 1000;

/* ---------- cenas ---------- */

const cenaPelicula: Cena = (i) => (
  <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden>
    <defs>
      <pattern id="jato" width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="#fff" fillOpacity="0.35" />
        <circle cx="3" cy="3" r="0.6" fill="#fff" fillOpacity="0.2" />
      </pattern>
    </defs>
    <rect x="40" y="18" width="160" height="144" rx="6" fill="#151412" stroke={i >= 3 ? "#3B82F6" : "#3f3f46"} strokeWidth={i >= 3 ? 3 : 2} />
    <line x1="120" y1="18" x2="120" y2="162" stroke="#3f3f46" strokeWidth="2" />
    <path d="M58 40 L90 30 M58 56 L104 40" stroke="#fff" strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" />
    {i >= 1 && <rect x="42" y="20" width="156" height="140" rx="5" fill="url(#jato)" opacity={i === 1 ? 1 : 0.55} />}
    {i >= 2 && (
      <g stroke="#e4e4e7" strokeOpacity="0.8" fill="none">
        <circle cx="160" cy="70" r="5" />
        <circle cx="160" cy="70" r="12" strokeOpacity="0.4" />
        <path d="M160 70 L182 58 M160 70 L176 92 M160 70 L140 84" strokeOpacity="0.6" />
      </g>
    )}
    {i >= 3 && (
      <g stroke="#F0DBA8" strokeOpacity="0.9" fill="none" strokeWidth="1.4">
        <path d="M78 110 L60 96 M78 110 L96 128 M78 110 L58 130 M78 110 L100 96 L112 104" />
      </g>
    )}
    {i >= 3 && <rect x="42" y="20" width="156" height="140" rx="5" fill="#3B82F6" fillOpacity={i === 4 ? 0.16 : 0.08} />}
    {i === 4 && (
      <g>
        <path d="M120 52 L150 64 V92 C150 114 138 128 120 135 C102 128 90 114 90 92 V64 Z" fill="#09090b" fillOpacity="0.6" stroke="#3B82F6" strokeWidth="2.5" />
        <path d="M107 93 L117 103 L135 84" stroke="#F0DBA8" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
);

const CARRO = "M18 96 Q20 76 40 72 L80 64 Q100 44 126 42 L166 42 Q186 44 200 62 L222 68 Q234 72 234 88 L234 98 L18 98 Z";

const cenaAuto: Cena = (i) => {
  const cobertura = [0, 0.12, 0.5, 0.86, 1][i];
  return (
    <svg viewBox="0 0 252 150" className="h-full w-full" aria-hidden>
      <defs>
        <clipPath id="carroClip">
          <path d={CARRO} />
        </clipPath>
        <pattern id="carbono" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="3" height="6" fill="#18181b" />
          <rect x="3" width="3" height="6" fill="#27272a" />
        </pattern>
      </defs>
      <path d={CARRO} fill="#e4e4e7" />
      <g clipPath="url(#carroClip)">
        <motion.rect
          x="10"
          y="30"
          height="80"
          fill="#2a2d33"
          initial={false}
          animate={{ width: 230 * cobertura }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
        {i >= 3 && <path d="M86 64 Q102 46 126 44 L166 44 Q184 46 196 62 Z" fill="url(#carbono)" />}
        {cobertura > 0 && cobertura < 1 && <motion.rect y="30" width="2" height="80" fill="#3B82F6" initial={false} animate={{ x: 10 + 230 * cobertura }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} />}
      </g>
      <path d="M92 64 Q106 50 126 48 L146 48 L146 64 Z M152 48 L166 48 Q180 50 190 62 L152 64 Z" fill="#0c0c0c" stroke={i === 4 ? "#3B82F6" : "#52525b"} />
      <path d={CARRO} fill="none" stroke={i === 4 ? "#3B82F6" : "#71717a"} strokeWidth="1.5" />
      {[64, 190].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="100" r="17" fill="#09090b" stroke="#3f3f46" strokeWidth="3" />
          <circle cx={cx} cy="100" r="7" fill={i === 4 ? "#3B82F6" : "#52525b"} />
        </g>
      ))}
      <line x1="10" y1="118" x2="242" y2="118" stroke="#27272a" />
    </svg>
  );
};

const cenaGeladeira: Cena = (i) => {
  const madeira = [0, 0, 0.6, 1, 1][i];
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden>
      <defs>
        <pattern id="veio" width="40" height="12" patternUnits="userSpaceOnUse">
          <rect width="40" height="12" fill="#8a5a33" />
          <path d="M0 6 Q10 2 20 6 T40 6" stroke="#6b4226" strokeWidth="1.4" fill="none" />
          <path d="M0 10 Q12 8 22 11 T40 9" stroke="#a06b3e" strokeWidth="0.8" fill="none" />
        </pattern>
        <clipPath id="porta">
          <rect x="84" y="16" width="72" height="150" rx="8" />
        </clipPath>
      </defs>
      <rect x="84" y="16" width="72" height="150" rx="8" fill={i === 0 ? "#d4d4d8" : "#e4e4e7"} />
      {i === 0 && <circle cx="104" cy="120" r="7" fill="#a1a1aa" fillOpacity="0.4" />}
      <g clipPath="url(#porta)">
        <motion.rect x="84" y="16" width="72" fill="url(#veio)" initial={false} animate={{ height: 150 * madeira }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} />
      </g>
      <line x1="84" y1="70" x2="156" y2="70" stroke="#09090b" strokeOpacity="0.5" strokeWidth="2" />
      <rect x="84" y="16" width="72" height="150" rx="8" fill="none" stroke={i === 4 ? "#3B82F6" : "#52525b"} strokeWidth="1.5" />
      <rect x="146" y="34" width="4" height="22" rx="2" fill={i >= 3 ? "#d4a73a" : "#a1a1aa"} />
      <rect x="146" y="80" width="4" height="34" rx="2" fill={i >= 3 ? "#d4a73a" : "#a1a1aa"} />
      {i === 1 && (
        <g stroke="#3B82F6" strokeDasharray="4 3" fill="none">
          <path d="M70 16 V166 M64 16 H76 M64 166 H76" />
          <path d="M84 176 H156" />
          <text x="40" y="96" fill="#3B82F6" fontSize="10" fontFamily="monospace">1,8 m</text>
          <text x="96" y="178" fill="#3B82F6" fontSize="9" fontFamily="monospace" dy="-1">4,5 m²</text>
        </g>
      )}
      {i === 4 && <path d="M176 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z" fill="#d4a73a" />}
    </svg>
  );
};

const cenaParede: Cena = (i) => (
  <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden>
    <defs>
      <linearGradient id="marmore" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f4f4f5" />
        <stop offset="1" stopColor="#d4d4d8" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="220" height="120" fill={i >= 1 ? "url(#marmore)" : "#52525b"} />
    {i >= 1 && (
      <g fill="none" stroke="#c9a04a" strokeWidth="1.2" strokeOpacity="0.85">
        <path d="M20 30 Q60 50 80 40 T150 70 T225 60" />
        <path d="M40 120 Q70 90 110 100 T200 80" strokeOpacity="0.5" />
      </g>
    )}
    <rect x="10" y="130" width="220" height="40" fill="#18181b" />
    {/* armário */}
    <rect x="22" y="70" width="70" height="60" fill={i >= 2 ? "#141416" : "#a1a1aa"} stroke={i >= 2 ? "#3f3f46" : "#71717a"} />
    <line x1="57" y1="70" x2="57" y2="130" stroke={i >= 2 ? "#3f3f46" : "#71717a"} />
    {/* porta */}
    <rect x="176" y="40" width="40" height="90" fill={i >= 3 ? "#8a5a33" : "#a1a1aa"} stroke="#3f3f46" />
    <circle cx="208" cy="88" r="2" fill={i >= 3 ? "#d4a73a" : "#52525b"} />
    {/* ilha */}
    <rect x="104" y="112" width="60" height="34" rx="2" fill={i >= 3 ? "url(#marmore)" : "#71717a"} stroke={i === 4 ? "#3B82F6" : "#3f3f46"} />
    {i === 4 && <rect x="10" y="10" width="220" height="160" fill="none" stroke="#3B82F6" strokeWidth="2" />}
  </svg>
);

function cenaDashboard(saldos: { saldo: number; progresso: number; status: string; tom: string }[]): Cena {
  return function CenaDashboard(i) {
    const s = saldos[i];
    return (
      <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden>
        <rect x="70" y="6" width="100" height="170" rx="16" fill="#0b0b0e" stroke="#3f3f46" />
        <text x="82" y="32" fill="#a1a1aa" fontSize="7" fontFamily="monospace">SALDO · JORG</text>
        <text x="82" y="52" fill={i === 4 ? "#10B981" : "#fff"} fontSize="16" fontWeight="700" fontFamily="sans-serif">
          {brl(s.saldo).replace(/\s/g, " ")}
        </text>
        <rect x="82" y="66" width="76" height="40" rx="8" fill="#18181b" />
        <text x="88" y="80" fill="#e4e4e7" fontSize="7" fontFamily="sans-serif">{i === 0 ? "Sem indicações" : "Maria Silva"}</text>
        <text x="88" y="92" fill={s.tom} fontSize="6.5" fontFamily="monospace">{s.status}</text>
        <rect x="88" y="97" width="64" height="3" rx="1.5" fill="#27272a" />
        <motion.rect x="88" y="97" height="3" rx="1.5" fill={s.tom} initial={false} animate={{ width: (64 * s.progresso) / 100 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={92 + k * 14} cy="124" r="4" fill={k <= i - 1 || (i === 4 && k === 4) ? "#3B82F6" : "#27272a"} />
        ))}
        <rect x="82" y="146" width="76" height="18" rx="9" fill={i === 4 ? "#10B981" : "#27272a"} />
        <text x="120" y="158" fill={i === 4 ? "#09090b" : "#71717a"} fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
          Solicitar PIX
        </text>
      </svg>
    );
  };
}

/* ---------- roteiros com preços do Creator Hub ---------- */

export function montarReels(c: PlatformConfig) {
  const preco = (id: string) => c.servicos.peliculaSeguranca.find((p) => p.id === id)?.preco ?? 0;
  const civic = precoEnvelopamento(c, "3m-1080", "fosco", c.servicos.envelopamento.m2MedioTotal);
  const splitCivic = calcularSplit(civic.total, c.taxas);
  const geladeira = precoLinhas(c.servicos.arquitetonico, [{ itemId: "geladeira", quantidade: 1 }]).total;
  const splitGel = calcularSplit(geladeira, c.taxas);
  const parede = precoLinhas(c.servicos.arquitetonico, [{ itemId: "parede", largura: 3, altura: 2, quantidade: 1 }]).total;
  const splitParede = calcularSplit(parede, c.taxas);
  const m2Parede = c.servicos.arquitetonico.find((a) => a.id === "parede")?.preco ?? 0;
  const m2Movel = c.servicos.arquitetonico.find((a) => a.id === "movel")?.preco ?? 0;
  const porta = c.servicos.arquitetonico.find((a) => a.id === "porta")?.preco ?? 0;
  const orcMaria = 1440;
  const comissaoMaria = calcularSplit(orcMaria, c.taxas).indicador;

  return [
    {
      id: "pelicula",
      nome: "Película: jateada até ultra",
      cena: cenaPelicula,
      quadros: [
        { etiqueta: "Antes", titulo: "Vidro comum", detalhe: "Sem proteção" },
        { etiqueta: "Jateada", titulo: "Privacidade", detalhe: `${brl(preco("jateada"))}/m²` },
        { etiqueta: "Antivandalismo", titulo: "Segurança", detalhe: `${brl(preco("antivandalismo"))}/m² · protege contra impactos` },
        { etiqueta: "Alta rigidez", titulo: "Ultra resistente", detalhe: `${brl(preco("alta-rigidez"))}/m² · não estilhaça` },
        { etiqueta: "Película ativa", titulo: "Proteção 100%", detalhe: `Selo de garantia ${c.site.garantiaAnos} anos` },
      ] as Quadro[],
    },
    {
      id: "auto",
      nome: "Auto: total fosco",
      cena: cenaAuto,
      quadros: [
        { etiqueta: "Antes", titulo: "Branco de fábrica", detalhe: "Pintura original preservada" },
        { etiqueta: "Início", titulo: `${civic.areaM2} m² · ${civic.marca.nome}`, detalhe: `${brl(civic.valorM2)}/m² com fosco` },
        { etiqueta: "Em andamento", titulo: "50% aplicado", detalhe: `Orçamento ${brl(civic.total)}` },
        { etiqueta: "Quase pronto", titulo: "Fosco + carbono", detalhe: "Teto e capô em fibra de carbono" },
        { etiqueta: "Depois", titulo: "Entregue", detalhe: `Você ${brl(splitCivic.plataforma)} + Indicador ${brl(splitCivic.indicador)}` },
      ] as Quadro[],
    },
    {
      id: "geladeira",
      nome: "Geladeira madeira",
      cena: cenaGeladeira,
      quadros: [
        { etiqueta: "Antes", titulo: "Branca antiga", detalhe: "Manchas e amarelado" },
        { etiqueta: "Preparação", titulo: "4,5 m² medidos", detalhe: "Limpeza e desengraxe" },
        { etiqueta: "Aplicação", titulo: "Vinil carvalho", detalhe: `${brl(geladeira)} valor fechado` },
        { etiqueta: "Acabamento", titulo: "Puxadores dourados", detalhe: "Bordas seladas" },
        { etiqueta: "Depois", titulo: "Geladeira nova", detalhe: `Você ${brl(splitGel.plataforma)} + Indicador ${brl(splitGel.indicador)}` },
      ] as Quadro[],
    },
    {
      id: "parede",
      nome: "Parede e móveis",
      cena: cenaParede,
      quadros: [
        { etiqueta: "Antes", titulo: "Ambiente sem graça", detalhe: "Parede cinza e móveis gastos" },
        { etiqueta: "Parede", titulo: "Mármore branco", detalhe: `Veios dourados · ${brl(m2Parede)}/m²` },
        { etiqueta: "Móveis", titulo: "Preto fosco", detalhe: `${brl(m2Movel)}/m²` },
        { etiqueta: "Porta e ilha", titulo: "Madeira + mármore", detalhe: `Porta ${brl(porta)} fixo` },
        { etiqueta: "Depois", titulo: "Luxo total", detalhe: `${brl(parede)} = Você ${brl(splitParede.plataforma)} + Indicador ${brl(splitParede.indicador)}` },
      ] as Quadro[],
    },
    {
      id: "dashboard",
      nome: "Dashboard NEXUS",
      cena: cenaDashboard([
        { saldo: 0, progresso: 0, status: "CÓDIGO JORG", tom: "#71717a" },
        { saldo: 0, progresso: 20, status: "PENDENTE 20%", tom: "#FACC15" },
        { saldo: 0, progresso: 40, status: "EM CONTATO 40%", tom: "#3B82F6" },
        { saldo: 0, progresso: 60, status: "ORÇAMENTO 60%", tom: "#3B82F6" },
        { saldo: 200, progresso: 100, status: "PAGO 100%", tom: "#10B981" },
      ]),
      quadros: [
        { etiqueta: "Início", titulo: "Saldo R$ 0,00", detalhe: "Código JORG" },
        { etiqueta: "Nova indicação", titulo: "Maria Silva", detalhe: "IND-20240512-JORG-001 · 21999998888" },
        { etiqueta: "Em contato", titulo: "40%", detalhe: "Ligação feita" },
        { etiqueta: "Orçamento gerado", titulo: "60%", detalhe: brl(orcMaria) },
        { etiqueta: "Pago", titulo: `Comissão ${brl(comissaoMaria)}`, detalhe: "Saldo R$ 200,00 disponível para PIX" },
      ] as Quadro[],
    },
  ];
}

export function Reel({ nome, quadros, cena, className }: { nome: string; quadros: Quadro[]; cena: Cena; className?: string }) {
  const [i, setI] = useState(0);
  const [visivel, setVisivel] = useState(false);
  const reduzir = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visivel || reduzir) return;
    const t = setTimeout(() => setI((v) => (v + 1) % quadros.length), DURACAO_MS);
    return () => clearTimeout(t);
  }, [i, visivel, reduzir, quadros.length]);

  const q = quadros[i];
  return (
    <figure ref={ref} className={cn("vidro flex min-w-0 flex-col gap-4 overflow-hidden p-4", className)} aria-label={nome}>
      <div className="flex gap-1" aria-hidden>
        {quadros.map((_, k) => (
          <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              className={cn("block h-full rounded-full bg-neon", k < i ? "w-full" : k === i ? (reduzir ? "w-full" : "w-full origin-left") : "w-0")}
              style={k === i && !reduzir && visivel ? { animation: `encher ${DURACAO_MS}ms linear` } : undefined}
            />
          </span>
        ))}
      </div>
      <div className="relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-2xl bg-zinc-950/70">
        {cena(i)}
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-zinc-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neon backdrop-blur">
          {String(i + 1).padStart(2, "0")}/05 · {q.etiqueta}
        </span>
      </div>
      <figcaption className="flex min-h-[64px] items-end justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(2px)", transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="min-w-0"
          >
            <p className="text-lg font-semibold leading-tight text-white">{q.titulo}</p>
            <p className="num mt-1 text-sm text-zinc-400">{q.detalhe}</p>
          </motion.div>
        </AnimatePresence>
        {reduzir && (
          <div className="flex shrink-0 gap-1">
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10" onClick={() => setI((v) => (v + 4) % 5)} aria-label="Quadro anterior">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10" onClick={() => setI((v) => (v + 1) % 5)} aria-label="Próximo quadro">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </figcaption>
      <style>{`@keyframes encher{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
    </figure>
  );
}

export function GaleriaReels({ apenas }: { apenas?: string[] }) {
  const { config } = usePlataforma();
  const reels = montarReels(config).filter((r) => !apenas || apenas.includes(r.id));
  if (reels.length === 1) {
    const r = reels[0];
    return <Reel nome={r.nome} quadros={r.quadros} cena={r.cena} className="w-full max-w-md" />;
  }
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sem-barra sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {reels.map((r) => (
        <Reel key={r.id} nome={r.nome} quadros={r.quadros} cena={r.cena} className="w-[82%] shrink-0 snap-center sm:w-auto" />
      ))}
    </div>
  );
}
