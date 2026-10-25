import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "./db";

const Login = z.object({ email: z.string().email(), senha: z.string().min(8) });

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/entrar" },
  providers: [
    Credentials({
      name: "E-mail e senha",
      credentials: { email: { label: "E-mail", type: "email" }, senha: { label: "Senha", type: "password" } },
      async authorize(cred) {
        const p = Login.safeParse(cred);
        if (!p.success) return null;
        const u = await db.usuario.findUnique({ where: { email: p.data.email.toLowerCase() } });
        if (!u || u.excluidoEm) return null;
        const ok = await bcrypt.compare(p.data.senha, u.senhaHash);
        return ok ? { id: u.id, name: u.nome, email: u.email, papel: u.papel } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.papel = (user as { papel?: string }).papel;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { papel?: unknown; id?: string }).papel = token.papel;
      if (session.user) (session.user as { id?: string }).id = token.sub;
      return session;
    },
  },
};
