import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateCollectionForm } from "@/components/profile/create-collection-form";

export const metadata = { title: "Coleções" };

export default async function ColecoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: collections } = await supabase
    .from("collections")
    .select("id, title, slug, is_public")
    .eq("author_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user!.id)
    .single();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-2xl">Coleções</h1>

      {collections && collections.length > 0 && (
        <div className="flex flex-col gap-2">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/@${profile?.username}/colecoes/${c.slug}`}
              className="flex items-center justify-between border-b border-border py-3 hover:text-primary"
            >
              <span className="font-serif text-lg">{c.title}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {c.is_public ? "pública" : "privada"}
              </span>
            </Link>
          ))}
        </div>
      )}

      <CreateCollectionForm />
    </div>
  );
}
