import { createClient } from "@/lib/supabase/server";
import { createPoem } from "@/lib/actions/poems";
import { PoemEditor } from "@/components/editor/poem-editor";

export const metadata = { title: "Novo poema" };

export default async function NovoPoemaPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl">Novo poema</h1>
      <PoemEditor action={createPoem} categories={categories ?? []} />
    </div>
  );
}
