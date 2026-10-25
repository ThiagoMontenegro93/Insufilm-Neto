import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variantes = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold tracking-tight transition-[transform,box-shadow,background-color,opacity] duration-150 ease-saida active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variante: {
        neon: "bg-neon text-zinc-950 shadow-neon hover:shadow-neon-lg",
        esmeralda: "bg-esmeralda text-zinc-950 shadow-esmeralda hover:brightness-110",
        vidro: "border border-white/10 bg-white/[0.06] text-zinc-100 backdrop-blur-xl hover:bg-white/[0.1]",
        contorno: "border border-neon/40 text-neon hover:bg-neon/10",
        fantasma: "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
        perigo: "border border-perigo/40 text-perigo hover:bg-perigo/10",
      },
      tamanho: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-14 px-7 text-base",
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
