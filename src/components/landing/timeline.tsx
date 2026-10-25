import { Banknote, Handshake, Inbox, PhoneCall, ReceiptText } from "lucide-react";
import { ETAPAS_INDICACAO } from "@/lib/referral";

const ICONES = [Inbox, PhoneCall, ReceiptText, Handshake, Banknote];
const TEXTOS = [
  "Você cadastra o telefone do cliente. O sistema gera o código IND-AAAAMMDD-SEUCODIGO-001.",
  "A filial liga para o cliente e registra o contato no código.",
  "Medição e orçamento com os preços oficiais da plataforma.",
  "Cliente aprova e o serviço é agendado e aplicado.",
  "Sua comissão entra no saldo e você saca por PIX.",
];

export function TimelineEtapas() {
  return (
    <ol className="relative flex flex-col gap-0">
      {ETAPAS_INDICACAO.map((e, i) => {
        const Icone = ICONES[i];
        const ultima = i === ETAPAS_INDICACAO.length - 1;
        return (
          <li key={e.status} className="relative grid grid-cols-[48px_1fr] gap-4 pb-8 last:pb-0">
            {!ultima && <span className="absolute left-[23px] top-12 h-[calc(100%-48px)] w-px bg-gradient-to-b from-neon/60 to-neon/10" aria-hidden />}
            <span
              className={
                ultima
                  ? "grid h-12 w-12 place-items-center rounded-2xl border border-esmeralda/40 bg-esmeralda/10 text-esmeralda shadow-esmeralda"
                  : "grid h-12 w-12 place-items-center rounded-2xl border border-neon/30 bg-neon/[0.08] text-neon"
              }
            >
              <Icone className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-col gap-1.5 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-tx">{e.rotulo}</h3>
                <span className="num rounded-full bg-linha/[0.06] px-2 py-0.5 font-mono text-[11px] text-tx3">{e.progresso}%</span>
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-tx3">{TEXTOS[i]}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
