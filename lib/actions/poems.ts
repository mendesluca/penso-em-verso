"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify, readingTimeSeconds, excerptFrom } from "@/lib/text/poem";

export type ActionState = { error: string | null };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function uniqueSlugFor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  authorId: string,
  title: string,
  ignorePoemId?: string,
) {
  const base = slugify(title) || "poema";
  let slug = base;
  let attempt = 1;

  while (true) {
    let query = supabase
      .from("poems")
      .select("id")
      .eq("author_id", authorId)
      .eq("slug", slug)
      .limit(1);
    if (ignorePoemId) query = query.neq("id", ignorePoemId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    attempt += 1;
    slug = `${base}-${attempt}`;
  }
}

export async function createPoem(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user } = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const publish = formData.get("intent") === "publish";

  if (!title || !content) return { error: "Título e conteúdo são obrigatórios." };

  const slug = await uniqueSlugFor(supabase, user.id, title);

  const { data: poem, error } = await supabase
    .from("poems")
    .insert({
      author_id: user.id,
      title,
      content,
      slug,
      excerpt: excerptFrom(content),
      category_id: categoryId,
      reading_time_seconds: readingTimeSeconds(content),
      status: publish ? "published" : "draft",
      published_at: publish ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !poem) return { error: "Não foi possível salvar o poema." };

  revalidatePath("/dashboard/poemas");
  redirect(`/dashboard/poemas/${poem.id}/editar`);
}

export async function updatePoem(
  poemId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const intent = formData.get("intent");

  if (!title || !content) return { error: "Título e conteúdo são obrigatórios." };

  const { data: existing } = await supabase
    .from("poems")
    .select("slug, status, author_id")
    .eq("id", poemId)
    .single();

  if (!existing || existing.author_id !== user.id) return { error: "Poema não encontrado." };

  const willPublish = intent === "publish" || existing.status === "published";
  const slug = await uniqueSlugFor(supabase, user.id, title, poemId);

  const { error } = await supabase
    .from("poems")
    .update({
      title,
      content,
      slug,
      excerpt: excerptFrom(content),
      category_id: categoryId,
      reading_time_seconds: readingTimeSeconds(content),
      status: willPublish ? "published" : "draft",
      published_at:
        willPublish && existing.status !== "published" ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", poemId);

  if (error) return { error: "Não foi possível salvar as alterações." };

  revalidatePath("/dashboard/poemas");
  revalidatePath(`/dashboard/poemas/${poemId}/editar`);
  return { error: null };
}

export async function deletePoem(poemId: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("poems").delete().eq("id", poemId).eq("author_id", user.id);
  revalidatePath("/dashboard/poemas");
}

export async function toggleLike(poemId: string, poemPath: string) {
  const { supabase, user } = await requireUser();

  const { data: existing } = await supabase
    .from("likes")
    .select("poem_id")
    .eq("poem_id", poemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("poem_id", poemId).eq("user_id", user.id);
  } else {
    await supabase.from("likes").insert({ poem_id: poemId, user_id: user.id });
  }

  revalidatePath(poemPath);
}

export async function toggleFavorite(poemId: string, poemPath: string) {
  const { supabase, user } = await requireUser();

  const { data: existing } = await supabase
    .from("favorites")
    .select("poem_id")
    .eq("poem_id", poemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("poem_id", poemId).eq("user_id", user.id);
  } else {
    await supabase.from("favorites").insert({ poem_id: poemId, user_id: user.id });
  }

  revalidatePath(poemPath);
}

export async function addComment(poemId: string, poemPath: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await supabase.from("comments").insert({ poem_id: poemId, author_id: user.id, content });
  revalidatePath(poemPath);
}

export async function toggleFollow(targetUserId: string, profilePath: string) {
  const { supabase, user } = await requireUser();
  if (user.id === targetUserId) return;

  const { data: existing } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);
  } else {
    await supabase.from("follows").insert({ follower_id: user.id, following_id: targetUserId });
  }

  revalidatePath(profilePath);
}
