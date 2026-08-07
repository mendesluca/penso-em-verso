"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { error: null };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  if (state.info) {
    return (
      <div className="flex flex-col gap-3 rounded-md border border-border p-6 text-center">
        <p className="font-serif text-lg">Quase lá</p>
        <p className="text-sm text-muted-foreground">{state.info}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display_name">Nome</Label>
        <Input id="display_name" name="display_name" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">@usuário</Label>
        <Input id="username" name="username" placeholder="ex: maria_poeta" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando conta…" : "Criar conta"}
      </Button>
      <p className="text-center font-mono text-xs text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-foreground hover:text-primary">
          Entrar
        </Link>
      </p>
    </form>
  );
}
