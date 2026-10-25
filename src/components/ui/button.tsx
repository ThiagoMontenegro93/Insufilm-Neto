import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variantes = cva(
  "inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-[3px] font-semibold uppercase tracking-[0.16em] transition-[transform,box-shadow,background-color,opacity] duration-150 ease-saida active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variante: {
        neon: "bg-gradient-to-b from-ouro-soft via-ouro to-ouro-deep text-black hover:brightness-110",
        esmeralda: "bg-esmeralda text-zinc-950 shadow-esmeralda hover:brightness-110",
        vidro: "border border-white/25 bg-black/20 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/[0.06]",
        contorno: "border border-neon/40 text-neon hover:bg-neon/10",
        fantasma: "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
        perigo: "border border-perigo/40 text-perigo hover:bg-perigo/10",
      },
      tamanho: {
        sm: "h-9 px-4 text-[10.5px]",
        md: "h-11 px-6 text-[11.5px]",
        lg: "h-14 px-8 text-[12px]",
        icone: "h-10 w-10",
      },
    },
    defaultVariants: { variante: "neon", tamanho: "md" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof variantes> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variante, tamanho, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(variantes({ variante, tamanho }), className)} {...props} />;
});
Button.displayName = "Button";
