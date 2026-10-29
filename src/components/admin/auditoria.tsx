"use client";

import { useState } from "react";
import { ChevronDown, ClipboardList } from "lucide-react";
import { Cartao, Selo } from "@/components/ui/primitivos";
import { usePlataforma } from "@/lib/store";
import { cn } from "@/lib/utils";

const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" });

export function ListaAuditoria() {
  const { logs, pronto } = usePlataforma();
  const [aberto, setAberto] = useState<string | null>(null);

  if (pronto && logs.length === 0) {
    return (
      <Cartao className="flex flex-col items-center gap-3 py-14 text-center">
        <ClipboardList className="h-8 w-8 text-tx4" aria-hidden />
        <p className="font-medium text-tx">Nenhuma alteração registrada ainda</p>
        <p className="max-w-sm text-sm text-tx4">Quando alguém salvar uma aba do Creator Hub, o registro aparece aqui com o JSON de antes e depois.</p>
      </Cartao>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {logs.map((l) => {
        const on = aberto === l.id;
        return (
          <li key={l.id} className="vidro overflow-hidden">
            <button onClick={() => setAberto(on ? null : l.id)} aria-expanded={on} className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left">
              <Selo tom="neon">{l.acao}</Selo>
              <span className="min-w-0 flex-1 text-sm text-tx">{l.descricao}</span>
              <span className="num font-mono text-xs text-tx4">{dataHora.format(new Date(l.criadoEm))}</span>
              <ChevronDown className={cn("h-4 w-4 text-tx4 transition-transform duration-200", on && "rotate-180")} aria-hidden />
            </button>
            {on && (
              <div className="grid gap-px border-t border-linha/[0.06] bg-linha/[0.06] md:grid-cols-2">
                {[
                  { t: "Antes", v: l.antes },
                  { t: "Depois", v: l.depois },
                ].map((s) => (
                  <div key={s.t} className="min-w-0 bg-sup p-4">
                    <span className="rotulo">{s.t}</span>
                    <pre className="mt-2 max-h-80 overflow-auto font-mono text-[11px] leading-relaxed text-tx2">{JSON.stringify(s.v, null, 2)}</pre>
                  </div>
                ))}
                <p className="bg-sup px-4 py-2 font-mono text-[11px] text-tx4 md:col-span-2">por {l.usuario} · id {l.id}</p>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
