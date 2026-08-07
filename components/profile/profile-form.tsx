"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { error: null };

export interface ProfileFormValues {
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  instagram?: string;
}

export function ProfileForm({ values }: { values: ProfileFormValues }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display_name">Nome</Label>
        <Input id="display_name" name="display_name" defaultValue={values.display_name} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={values.bio ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="avatar_url">URL da foto de perfil</Label>
        <Input id="avatar_url" name="avatar_url" defaultValue={values.avatar_url ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="banner_url">URL do banner</Label>
        <Input id="banner_url" name="banner_url" defaultValue={values.banner_url ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" name="instagram" placeholder="@seu_usuario" defaultValue={values.instagram ?? ""} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Salvando…" : "Salvar perfil"}
      </Button>
    </form>
  );
}
