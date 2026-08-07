"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/text/poem";

export type ActionState = { error: string | null };

export async function updateProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();
  const bannerUrl = String(formData.get("banner_url") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();

  if (!displayName) return { error: "O nome de exibição é obrigatório." };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      banner_url: bannerUrl || null,
      social_links: instagram ? { instagram } : {},
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: "Não foi possível salvar o perfil." };

  revalidatePath("/dashboard/perfil");
  return { error: null };
}

export async function createCollection(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPublic = formData.get("is_public") === "on";

  if (!title) return { error: "Dê um título à coleção." };

  const slug = slugify(title) || "colecao";

  const { error } = await supabase.from("collections").insert({
    author_id: user.id,
    title,
    description: description || null,
    slug,
    is_public: isPublic,
  });

  if (error) return { error: "Não foi possível criar a coleção." };

  revalidatePath("/dashboard/colecoes");
  return { error: null };
}

export async function addPoemToCollection(collectionId: string, poemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count } = await supabase
    .from("collection_poems")
    .select("poem_id", { count: "exact", head: true })
    .eq("collection_id", collectionId);

  await supabase
    .from("collection_poems")
    .insert({ collection_id: collectionId, poem_id: poemId, position: count ?? 0 });

  revalidatePath(`/dashboard/colecoes/${collectionId}`);
}

export async function removePoemFromCollection(collectionId: string, poemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("collection_poems")
    .delete()
    .eq("collection_id", collectionId)
    .eq("poem_id", poemId);

  revalidatePath(`/dashboard/colecoes/${collectionId}`);
}
