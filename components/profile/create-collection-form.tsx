"use client";

import { useActionState } from "react";
import { createCollection, type ActionState } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { error: null };

export function CreateCollectionForm() {
  const [state, formAction, pending] = useActionState(createCollection, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4 rounded-md border border-border p-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" placeholder="Ex: Poemas de inverno" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_public" defaultChecked className="size-4" />
        Coleção pública
      </label>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Criando…" : "Criar coleção"}
      </Button>
    </form>
  );
}
