import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { PainelProspeccao } from "@/components/admin/prospeccao";

export const metadata: Metadata = { title: "Prospecção" };

export default function PaginaProspeccao() {
  return (
    <>
      <CabecalhoPagina eyebrow="Prospecção · Dupla validação" titulo="Leads quentes, nunca frios." descricao="Busque por bairro ou por CNPJ. Cada empresa passa pelo Google e pelo site oficial antes de receber qualquer mensagem." />
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <PainelProspeccao />
      </div>
    </>
  );
}
