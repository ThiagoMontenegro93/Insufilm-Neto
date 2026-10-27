"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Campo, Cartao } from "@/components/ui/primitivos";

export default function Entrar() {
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCarregando(true);
    const f = new FormData(e.currentTarget);
    const voltar = new URLSearchParams(window.location.search).get("voltar") ?? "/";
    const r = await signIn("credentials", { email: f.get("email"), senha: f.get("senha"), redirect: false });
    setCarregando(false);
    if (r?.ok) window.location.href = voltar.startsWith("/") ? voltar : "/";
    else setErro("E-mail ou senha incorretos.");
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md items-center px-4 py-16">
      <Cartao forte className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="rotulo text-neon/80">Acesso</span>
          <h1 className="text-3xl font-bold tracking-tight text-tx">Entrar no HUB</h1>
        </div>
        <form onSubmit={enviar} className="flex flex-col gap-4">
          <Campo rotulo="E-mail" htmlFor="email">
            <input id="email" name="email" type="email" autoComplete="email" required className="campo" />
          </Campo>
          <Campo rotulo="Senha" htmlFor="senha">
            <input id="senha" name="senha" type="password" autoComplete="current-password" required minLength={8} className="campo" />
          </Campo>
          {erro && <p className="text-sm text-perigo">{erro}</p>}
          <Button type="submit" tamanho="lg" disabled={carregando}>
            {carregando ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </Cartao>
    </div>
  );
}
