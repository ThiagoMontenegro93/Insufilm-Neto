import { ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const demo = !process.env.NEXTAUTH_SECRET;
  return (
    // o painel fica no azul-noite da marca; a vitrine é branca
    <div className="escuro min-h-dvh bg-noite-fundo">
      {demo && (
        <div className="border-b border-alerta/20 bg-alerta/[0.06]">
          <p className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs text-alerta sm:px-6">
            <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
            Modo demonstração: sem NEXTAUTH_SECRET o painel fica aberto. Em produção, só SUPER_ADMIN entra.
          </p>
        </div>
      )}
      {children}
    </div>
  );
}
