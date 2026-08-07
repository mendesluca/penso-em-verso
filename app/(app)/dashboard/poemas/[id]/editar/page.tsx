import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePoem, deletePoem } from "@/lib/actions/poems";
import { PoemEditor } from "@/components/editor/poem-editor";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Editar poema" };

export default async function EditarPoemaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: poem }, { data: categories }, { data: sentiments }, { data: poemTags }] =
    await Promise.all([
      supabase
        .from("poems")
        .select("id, title, content, category_id, status")
        .eq("id", id)
        .eq("author_id", user.id)
        .single(),
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("tags").select("id, name").eq("type", "sentimento").order("name"),
      supabase.from("poem_tags").select("tag_id").eq("poem_id", id),
    ]);

  if (!poem) notFound();

  const boundUpdate = updatePoem.bind(null, poem.id);
  const boundDelete = deletePoem.bind(null, poem.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Editar poema</h1>
        <form action={boundDelete}>
          <Button variant="ghost" size="sm" type="submit" className="text-destructive">
            Excluir
          </Button>
        </form>
      </div>
      <PoemEditor
        action={boundUpdate}
        categories={categories ?? []}
        sentiments={sentiments ?? []}
        initialValues={{
          title: poem.title,
          content: poem.content,
          category_id: poem.category_id,
          status: poem.status,
          tagIds: (poemTags ?? []).map((t) => t.tag_id),
        }}
      />
    </div>
  );
}
