import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { DashboardParceiro } from "@/components/parceiro/dashboard";
import { Selo } from "@/components/ui/primitivos";

export const metadata: Metadata = { title: "Painel do parceiro" };

export default function PaginaParceiro() {
  return (
    <div className="escuro min-h-dvh bg-noite-fundo">
      <CabecalhoPagina eyebrow="Parceiro indicador" titulo="Olá, Seu Jorge." descricao="Seu saldo de indicações, os clientes que você indicou e os seus saques por PIX.">
        <div className="flex flex-wrap gap-2">
          <Selo tom="neon">Código JORG</Selo>
          <Selo tom="neutro">Dados de exemplo</Selo>
        </div>
      </CabecalhoPagina>
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <DashboardParceiro />
      </div>
    </div>
  );
}
