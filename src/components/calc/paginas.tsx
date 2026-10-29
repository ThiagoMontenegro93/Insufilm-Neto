"use client";

import { usePlataforma } from "@/lib/store";
import { CalculadoraM2 } from "./calculadora-m2";

export function CalcPelicula() {
  const { config } = usePlataforma();
  return <CalculadoraM2 itens={config.servicos.peliculaSeguranca} servico="película de segurança" rotuloVao="Vão" />;
}

export function CalcArquitetonico() {
  const { config } = usePlataforma();
  return <CalculadoraM2 itens={config.servicos.arquitetonico} servico="envelopamento arquitetônico" rotuloVao="Item" />;
}
