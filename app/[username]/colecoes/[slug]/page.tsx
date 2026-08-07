import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username: rawUsername, slug } = await params;
  const username = decodeURIComponent(rawUsername).replace(/^@/, "");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: collection } = await supabase
    .from("collections")
    .select("id, title, description")
    .eq("author_id", profile.id)
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!collection) notFound();

  const { data: items } = await supabase
    .from("collection_poems")
    .select("position, poem:poems(slug, title, excerpt, reading_time_seconds, published_at)")
    .eq("collection_id", collection.id)
    .order("position");

  const poems: PoemCardData[] = (items ?? [])
    .map((item) => (Array.isArray(item.poem) ? item.poem[0] : item.poem))
    .filter((poem): poem is NonNullable<typeof poem> => Boolean(poem))
    .map((poem) => ({ ...poem, author: { username: profile.username, display_name: profile.display_name } }));

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        Coleção de {profile.display_name}
      </p>
      <h1 className="mt-2 font-serif text-3xl">{collection.title}</h1>
      {collection.description && (
        <p className="mt-3 text-muted-foreground">{collection.description}</p>
      )}
      <div className="mt-10">
        {poems.length > 0 ? (
          poems.map((poem) => <PoemCard key={poem.slug} poem={poem} />)
        ) : (
          <p className="text-sm text-muted-foreground">Esta coleção ainda não tem poemas.</p>
        )}
      </div>
    </div>
  );
}
