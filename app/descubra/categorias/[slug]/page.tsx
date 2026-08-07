import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const { data: poems } = await supabase
    .from("poems")
    .select(
      "slug, title, excerpt, reading_time_seconds, published_at, author:profiles!poems_author_id_fkey(username, display_name)",
    )
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .returns<PoemCardData[]>();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Categoria</p>
      <h1 className="mt-1 font-serif text-3xl">{category.name}</h1>
      <div className="mt-10">
        {poems && poems.length > 0 ? (
          poems.map((poem) => <PoemCard key={poem.slug + poem.author?.username} poem={poem} />)
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum poema nesta categoria ainda.</p>
        )}
      </div>
    </div>
  );
}
