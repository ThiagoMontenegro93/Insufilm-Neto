import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { CreatorHub } from "@/components/admin/creator-hub";
import { Selo } from "@/components/ui/primitivos";

export const metadata: Metadata = { title: "Creator Hub" };

export default function PaginaCreator() {
  return (
    <>
      <CabecalhoPagina eyebrow="JR Filmes // NEXUS · Creator Hub" titulo="Controle da plataforma." descricao="Taxas, preços, regras de saque, integrações e módulos. Tudo que você salva aqui muda as calculadoras e os painéis na hora e fica registrado na auditoria.">
        <Selo tom="neon" className="w-fit">Acesso restrito</Selo>
      </CabecalhoPagina>
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <CreatorHub />
      </div>
    </>
  );
}
