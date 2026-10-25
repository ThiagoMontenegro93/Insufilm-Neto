import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { PainelEstoque } from "@/components/admin/estoque";

export const metadata: Metadata = { title: "Estoque" };

export default function PaginaEstoque() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Estoque · Bobinas e fornecedores"
        titulo="Cada metro da bobina, contado."
        descricao="Entrada por nota, baixa por serviço com perda e retalho, alerta de estoque mínimo e custo médio por m² alimentando o preço."
      />
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <PainelEstoque />
      </div>
    </>
  );
}
