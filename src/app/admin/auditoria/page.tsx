import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho";
import { ListaAuditoria } from "@/components/admin/auditoria";

export const metadata: Metadata = { title: "Auditoria" };

export default function PaginaAuditoria() {
  return (
    <>
      <CabecalhoPagina eyebrow="Auditoria" titulo="Quem mudou o quê, e quando." descricao="Todo CONFIG_PLATAFORMA_ALTERADA guarda um snapshot JSON do antes e do depois." />
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <ListaAuditoria />
      </div>
    </>
  );
}
