import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Buscar" };

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const supabase = await createClient();

  const [{ data: poems }, { data: authors }] = query
    ? await Promise.all([
        supabase
          .from("poems")
          .select(
            "slug, title, excerpt, reading_time_seconds, published_at, author:profiles!poems_author_id_fkey(username, display_name)",
          )
          .eq("status", "published")
          .textSearch("search_vector", query, { type: "websearch", config: "portuguese" })
          .limit(20)
          .returns<PoemCardData[]>(),
        supabase
          .from("profiles")
          .select("username, display_name, bio")
          .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
          .limit(6),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-6 font-serif text-2xl">Buscar</h1>
      <form className="flex gap-2">
        <Input name="q" defaultValue={query} placeholder="Título, autor, palavra-chave…" />
        <Button type="submit">Buscar</Button>
      </form>

      {query && (
        <div className="mt-10 flex flex-col gap-10">
          {authors && authors.length > 0 && (
            <section>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Autores
              </h2>
              <div className="flex flex-col gap-2">
                {authors.map((a) => (
                  <Link
                    key={a.username}
                    href={`/@${a.username}`}
                    className="font-serif text-lg hover:text-primary"
                  >
                    {a.display_name}{" "}
                    <span className="font-mono text-xs text-muted-foreground">@{a.username}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Poemas
            </h2>
            {poems && poems.length > 0 ? (
              poems.map((poem) => <PoemCard key={poem.slug + poem.author?.username} poem={poem} />)
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum poema encontrado para “{query}”.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
