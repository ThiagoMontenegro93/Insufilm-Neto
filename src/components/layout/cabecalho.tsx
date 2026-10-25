import { cn } from "@/lib/utils";

export function CabecalhoPagina({ eyebrow, titulo, descricao, children, className }: { eyebrow: string; titulo: React.ReactNode; descricao?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <div className="grade-fundo pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -top-48 left-1/3 h-96 w-[640px] rounded-full bg-ouro/[0.06] blur-3xl" aria-hidden />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-8 pt-10 sm:px-6 md:pt-14">
        <span className="rotulo flex items-center gap-3 text-ouro"><span className="h-px w-8 bg-ouro/70" aria-hidden />{eyebrow}</span>
        <h1 className="display cromado text-balance text-[2.3rem] leading-[0.98] tracking-[-0.03em] sm:text-[3.4rem]">{titulo}</h1>
        {descricao && <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-zinc-400 sm:text-base">{descricao}</p>}
        {children}
      </div>
    </section>
  );
}
