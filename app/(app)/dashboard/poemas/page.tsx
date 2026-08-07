import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuthorPoemRow } from "@/components/poem/author-poem-row";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Meus poemas" };

export default async function MeusPoemasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: poems } = await supabase
    .from("poems")
    .select("id, title, status, updated_at")
    .eq("author_id", user!.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Meus poemas</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/novo-poema">Novo poema</Link>
        </Button>
      </div>
      {poems && poems.length > 0 ? (
        <div>
          {poems.map((poem) => (
            <AuthorPoemRow key={poem.id} poem={poem} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Você ainda não escreveu nenhum poema.</p>
      )}
    </div>
  );
}
