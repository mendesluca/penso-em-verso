"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signInWithGoogle, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <form action={signInWithGoogle}>
        <Button type="submit" variant="outline" className="w-full">
          Entrar com Google
        </Button>
      </form>

      <div className="flex justify-between font-mono text-xs text-muted-foreground">
        <Link href="/recuperar-senha" className="hover:text-foreground">
          Esqueci minha senha
        </Link>
        <Link href="/cadastro" className="hover:text-foreground">
          Criar conta
        </Link>
      </div>
    </div>
  );
}
