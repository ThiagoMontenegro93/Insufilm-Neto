import { cn } from "@/lib/utils";

export function Cartao({ className, forte, ...props }: React.HTMLAttributes<HTMLDivElement> & { forte?: boolean }) {
  return <div className={cn(forte ? "vidro-forte" : "vidro", "p-5 sm:p-6", className)} {...props} />;
}

const tons = {
  neon: "border-neon/30 bg-neon/10 text-neon",
  esmeralda: "border-esmeralda/30 bg-esmeralda/10 text-esmeralda-soft",
  alerta: "border-alerta/30 bg-alerta/10 text-alerta",
  perigo: "border-perigo/30 bg-perigo/10 text-perigo",
  neutro: "border-white/10 bg-white/[0.05] text-zinc-300",
} as const;

export type Tom = keyof typeof tons;

export function Selo({ tom = "neutro", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tom?: Tom }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider", tons[tom], className)}
      {...props}
    />
  );
}

export function Campo({
  rotulo,
  dica,
  erro,
  htmlFor,
  children,
  className,
}: {
  rotulo: string;
  dica?: string;
  erro?: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="rotulo">
        {rotulo}
      </label>
      {children}
      {erro ? <p className="text-sm text-perigo">{erro}</p> : dica ? <p className="text-xs text-zinc-500">{dica}</p> : null}
    </div>
  );
}

export function Interruptor({
  id,
  ligado,
  onChange,
  rotulo,
}: {
  id: string;
  ligado: boolean;
  onChange: (v: boolean) => void;
  rotulo: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={() => onChange(!ligado)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200",
        ligado ? "border-esmeralda/50 bg-esmeralda/30" : "border-white/10 bg-white/[0.06]",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-transform duration-200 ease-saida",
          ligado ? "translate-x-[22px] bg-esmeralda shadow-esmeralda" : "translate-x-1 bg-zinc-400",
        )}
      />
    </button>
  );
}

export function Titulo({ eyebrow, titulo, descricao, className }: { eyebrow?: string; titulo: React.ReactNode; descricao?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-3", className)}>
      {eyebrow && <span className="rotulo flex items-center gap-3 text-ouro"><span className="h-px w-8 bg-ouro/70" aria-hidden />{eyebrow}</span>}
      <h2 className="display cromado text-balance text-[1.9rem] leading-[1] tracking-[-0.02em] sm:text-[2.6rem]">{titulo}</h2>
      {descricao && <p className="text-pretty text-[15px] leading-relaxed text-zinc-400 sm:text-base">{descricao}</p>}
    </div>
  );
}

export function BarraProgresso({ valor, tom = "neon" }: { valor: number; tom?: "neon" | "esmeralda" | "alerta" }) {
  const cor = { neon: "bg-neon shadow-neon", esmeralda: "bg-esmeralda shadow-esmeralda", alerta: "bg-alerta" }[tom];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]" role="progressbar" aria-valuenow={valor} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full origin-left rounded-full transition-transform duration-500 ease-saida", cor)} style={{ transform: `scaleX(${valor / 100})` }} />
    </div>
  );
}
