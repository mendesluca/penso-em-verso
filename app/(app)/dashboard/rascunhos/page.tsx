import { createClient } from "@/lib/supabase/server";
import { AuthorPoemRow } from "@/components/poem/author-poem-row";

export const metadata = { title: "Rascunhos" };

export default async function RascunhosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: poems } = await supabase
    .from("poems")
    .select("id, title, status, updated_at")
    .eq("author_id", user!.id)
    .eq("status", "draft")
    .order("updated_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl">Rascunhos</h1>
      {poems && poems.length > 0 ? (
        <div>
          {poems.map((poem) => (
            <AuthorPoemRow key={poem.id} poem={poem} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum rascunho no momento.</p>
      )}
    </div>
  );
}
