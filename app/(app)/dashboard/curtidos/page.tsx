import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";

export const metadata = { title: "Curtidos" };

export default async function CurtidosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("likes")
    .select(
      "created_at, poem:poems!inner(slug, title, excerpt, reading_time_seconds, published_at, status, author:profiles!poems_author_id_fkey(username, display_name))",
    )
    .eq("user_id", user.id)
    .eq("poem.status", "published")
    .order("created_at", { ascending: false });

  const poems: PoemCardData[] = (rows ?? [])
    .map((r) => (Array.isArray(r.poem) ? r.poem[0] : r.poem))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ ...p, author: Array.isArray(p.author) ? p.author[0] : p.author }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl">Curtidos</h1>
      {poems.length > 0 ? (
        <div>
          {poems.map((poem) => (
            <PoemCard key={poem.slug + poem.author?.username} poem={poem} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Você ainda não curtiu nenhum poema.</p>
      )}
    </div>
  );
}
