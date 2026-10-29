import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pct = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
export const num = (n: number, casas = 2) => n.toLocaleString("pt-BR", { maximumFractionDigits: casas });
