import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addPoemToCollection, removePoemFromCollection } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Gerenciar coleção" };

export default async function GerenciarColecaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: collection } = await supabase
    .from("collections")
    .select("id, title")
    .eq("id", id)
    .eq("author_id", user.id)
    .single();

  if (!collection) notFound();

  const [{ data: items }, { data: allPoems }] = await Promise.all([
    supabase
      .from("collection_poems")
      .select("position, poem:poems(id, title)")
      .eq("collection_id", id)
      .order("position"),
    supabase
      .from("poems")
      .select("id, title")
      .eq("author_id", user.id)
      .eq("status", "published")
      .order("title"),
  ]);

  const inCollection = (items ?? [])
    .map((item) => (Array.isArray(item.poem) ? item.poem[0] : item.poem))
    .filter((poem): poem is NonNullable<typeof poem> => Boolean(poem));

  const inCollectionIds = new Set(inCollection.map((p) => p.id));
  const available = (allPoems ?? []).filter((p) => !inCollectionIds.has(p.id));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/dashboard/colecoes" className="font-mono text-xs text-muted-foreground hover:text-primary">
          ← Coleções
        </Link>
        <h1 className="mt-2 font-serif text-2xl">{collection.title}</h1>
      </div>

      <section>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Nesta coleção
        </h2>
        {inCollection.length > 0 ? (
          <div className="flex flex-col gap-1">
            {inCollection.map((poem) => (
              <div
                key={poem.id}
                className="flex items-center justify-between border-b border-border py-3"
              >
                <span className="font-serif text-lg">{poem.title}</span>
                <form action={removePoemFromCollection.bind(null, id, poem.id)}>
                  <Button variant="ghost" size="sm" type="submit" className="text-destructive">
                    Remover
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum poema nesta coleção ainda.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Adicionar poema
        </h2>
        {available.length > 0 ? (
          <div className="flex flex-col gap-1">
            {available.map((poem) => (
              <div
                key={poem.id}
                className="flex items-center justify-between border-b border-border py-3"
              >
                <span className="font-serif text-lg">{poem.title}</span>
                <form action={addPoemToCollection.bind(null, id, poem.id)}>
                  <Button variant="outline" size="sm" type="submit">
                    Adicionar
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {allPoems && allPoems.length > 0
              ? "Todos os seus poemas publicados já estão nesta coleção."
              : "Publique um poema primeiro para poder adicioná-lo a uma coleção."}
          </p>
        )}
      </section>
    </div>
  );
}
