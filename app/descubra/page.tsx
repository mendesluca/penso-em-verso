import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Descobrir" };

const SENTIMENTS = [
  "melancolia",
  "esperanca",
  "amor",
  "saudade",
  "solidao",
  "natureza",
  "existencialismo",
];

export default async function DescubraPage() {
  const supabase = await createClient();

  const { data: poems } = await supabase
    .from("poems")
    .select(
      "slug, title, excerpt, reading_time_seconds, published_at, author:profiles(username, display_name)",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(10)
    .returns<PoemCardData[]>();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl">Descobrir</h1>
      <p className="mt-2 text-muted-foreground">Curadoria, não algoritmo.</p>

      <nav className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href="/descubra/em-alta">Em alta</Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/descubra/novos-autores">Novos autores</Link>
        </Button>
        {SENTIMENTS.map((s) => (
          <Button key={s} variant="ghost" size="sm" asChild>
            <Link href={`/descubra/sentimentos/${s}`} className="capitalize">
              {s}
            </Link>
          </Button>
        ))}
      </nav>

      <section className="mt-10">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Poemas recentes
        </h2>
        {poems && poems.length > 0 ? (
          poems.map((poem) => <PoemCard key={poem.slug + poem.author?.username} poem={poem} />)
        ) : (
          <p className="text-sm text-muted-foreground">Nada publicado ainda — volte em breve.</p>
        )}
      </section>
    </div>
  );
}
