"use client";

import { Facebook, Instagram, Mail } from "lucide-react";
import { usePlataforma } from "@/lib/store";
import { linkEmail, linkFacebook, linkInstagram, linkWhatsapp, telefoneFormatado } from "@/lib/contato";
import { cn } from "@/lib/utils";

/** Ícone do WhatsApp (balão com telefone), desenhado para não depender de pacote de marcas. */
export function IconeWhatsapp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="currentColor">
      <path d="M16.004 3C8.837 3 3.01 8.82 3.01 15.98c0 2.29.6 4.53 1.74 6.5L3 29l6.7-1.72a13 13 0 0 0 6.3 1.6h.004C23.17 28.88 29 23.06 29 15.9 29 8.75 23.17 3 16.004 3Zm0 23.7h-.003a10.8 10.8 0 0 1-5.5-1.5l-.4-.23-3.98 1.02 1.06-3.87-.26-.4a10.7 10.7 0 0 1-1.65-5.73c0-5.95 4.85-10.8 10.8-10.8 5.94 0 10.77 4.83 10.77 10.75 0 5.94-4.84 10.76-10.79 10.76Zm5.92-8.07c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.21.32-.83 1.06-1.02 1.27-.19.22-.37.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.85-1.6-1.9-1.8-2.23-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69s1.16 3.12 1.32 3.33c.16.22 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.25 1.48.21 2.03.13.62-.09 1.92-.78 2.19-1.54.27-.75.27-1.4.19-1.53-.08-.14-.29-.22-.62-.38Z" />
    </svg>
  );
}

/**
 * Bloco de contatos oficial, no formato das artes: WhatsApp em destaque, e-mail, Instagram e Facebook.
 * Os dados vêm do Creator Hub (aba Site).
 */
export function BlocoContatos({ className, mensagem = "Olá, Aplik Films! Quero um orçamento." }: { className?: string; mensagem?: string }) {
  const { site } = usePlataforma().config;
  const linhas = [
    { icone: <Mail className="h-5 w-5" strokeWidth={1.6} />, rotulo: "E-mail", valor: site.email.toUpperCase(), href: linkEmail(site), externo: false },
    { icone: <Instagram className="h-5 w-5" strokeWidth={1.6} />, rotulo: "Instagram", valor: `@${site.instagram.replace(/^@/, "")}`, href: linkInstagram(site), externo: true },
    { icone: <Facebook className="h-5 w-5" strokeWidth={1.6} />, rotulo: "Facebook", valor: site.facebookNome, href: linkFacebook(site), externo: true },
  ].filter((l) => l.valor.replace("@", "").trim());
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <a
        href={linkWhatsapp(site, mensagem)}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 text-tx transition-colors hover:text-[#1fae55]"
        aria-label={`Chamar no WhatsApp ${telefoneFormatado(site.whatsappComercial)}`}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_-10px_rgba(37,211,102,.8)]">
          <IconeWhatsapp className="h-7 w-7" />
        </span>
        <span className="num font-sans text-[1.9rem] font-extrabold leading-none tracking-[-0.01em] sm:text-[2.4rem]">{telefoneFormatado(site.whatsappComercial)}</span>
      </a>
      <ul className="flex flex-col gap-2">
        {linhas.map((l) => (
          <li key={l.rotulo}>
            <a
              href={l.href}
              {...(l.externo ? { target: "_blank", rel: "noreferrer" } : {})}
              className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.02em] text-tx2 transition-colors hover:text-tx sm:text-[14px]"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ouro/40 text-ouro">{l.icone}</span>
              <span className="sr-only">{l.rotulo}: </span>
              <span className="break-all">{l.valor}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
