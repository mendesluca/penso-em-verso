import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";

export const metadata = { title: "Em alta" };

export default async function EmAltaPage() {
  const supabase = await createClient();

  const { data: poems } = await supabase
    .from("poems")
    .select(
      "slug, title, excerpt, reading_time_seconds, published_at, view_count, author:profiles(username, display_name)",
    )
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(20)
    .returns<PoemCardData[]>();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl">Em alta</h1>
      <p className="mt-2 text-muted-foreground">Os poemas mais lidos da plataforma.</p>
      <div className="mt-10">
        {poems && poems.length > 0 ? (
          poems.map((poem) => <PoemCard key={poem.slug + poem.author?.username} poem={poem} />)
        ) : (
          <p className="text-sm text-muted-foreground">Ainda sem dados suficientes.</p>
        )}
      </div>
    </div>
  );
}
