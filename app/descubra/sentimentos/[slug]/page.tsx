import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";

export default async function SentimentoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("tags")
    .select("id, name")
    .eq("slug", slug)
    .eq("type", "sentimento")
    .single();

  if (!tag) notFound();

  const { data: rows } = await supabase
    .from("poem_tags")
    .select(
      "poem:poems!inner(slug, title, excerpt, reading_time_seconds, published_at, status, author:profiles!poems_author_id_fkey(username, display_name))",
    )
    .eq("tag_id", tag.id)
    .eq("poem.status", "published");

  const poems: PoemCardData[] = (rows ?? [])
    .map((r) => (Array.isArray(r.poem) ? r.poem[0] : r.poem))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ ...p, author: Array.isArray(p.author) ? p.author[0] : p.author }));

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Sentimento</p>
      <h1 className="mt-1 font-serif text-3xl">{tag.name}</h1>
      <div className="mt-10">
        {poems.length > 0 ? (
          poems.map((poem) => <PoemCard key={poem.slug + poem.author?.username} poem={poem} />)
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum poema marcado com {tag.name.toLowerCase()} ainda.</p>
        )}
      </div>
    </div>
  );
}
