import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";

export default async function LandingPage() {
  const supabase = await createClient();

  const { data: poems } = await supabase
    .from("poems")
    .select(
      "slug, title, excerpt, reading_time_seconds, published_at, author:profiles!poems_author_id_fkey(username, display_name)",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(7)
    .returns<PoemCardData[]>();

  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .limit(6);

  const [featured, ...recent] = poems ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div className="flex flex-col justify-center gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            Uma biblioteca, não um feed
          </p>
          <h1 className="text-balance font-serif text-4xl leading-tight md:text-5xl">
            A casa da poesia brasileira independente.
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Publique seus poemas, construa um acervo permanente e uma identidade como
            escritor — longe do algoritmo, perto de quem lê.
          </p>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link href="/cadastro">Comece a escrever</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/descubra">Descobrir poemas</Link>
            </Button>
          </div>
        </div>

        {featured?.author ? (
          <Link
            href={`/@${featured.author.username}/${featured.slug}`}
            className="flex flex-col justify-center gap-4 rounded-md border border-border bg-card p-8"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Poema em destaque
            </p>
            <h2 className="text-balance font-serif text-2xl leading-snug">{featured.title}</h2>
            {featured.excerpt && (
              <p className="text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
            )}
            <p className="font-mono text-xs text-muted-foreground">
              — {featured.author.display_name}
            </p>
          </Link>
        ) : (
          <div className="flex flex-col justify-center gap-3 rounded-md border border-dashed border-border p-8 text-muted-foreground">
            <p className="font-serif text-xl">Nenhum poema publicado ainda.</p>
            <p className="text-sm">Seja a primeira pessoa a inaugurar este acervo.</p>
          </div>
        )}
      </section>

      {categories && categories.length > 0 && (
        <section className="flex flex-wrap gap-2 border-t border-border py-8">
          {categories.map((c) => (
            <Button key={c.slug} variant="secondary" size="sm" asChild>
              <Link href={`/descubra/categorias/${c.slug}`}>{c.name}</Link>
            </Button>
          ))}
        </section>
      )}

      <section className="border-t border-border py-12">
        <h2 className="mb-2 font-serif text-2xl">Últimos poemas</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Publicados recentemente pela comunidade.
        </p>
        {recent.length > 0 ? (
          <div>
            {recent.map((poem) => (
              <PoemCard key={poem.slug + poem.author?.username} poem={poem} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Assim que autores publicarem, os poemas mais recentes aparecem aqui.
          </p>
        )}
      </section>

      <section className="border-t border-border py-16 text-center">
        <h2 className="mb-3 font-serif text-2xl">Sua obra merece um lar permanente.</h2>
        <Button size="lg" asChild>
          <Link href="/cadastro">Criar minha conta</Link>
        </Button>
      </section>
    </div>
  );
}
