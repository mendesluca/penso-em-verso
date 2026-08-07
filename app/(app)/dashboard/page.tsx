import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Painel" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: published } = await supabase
    .from("poems")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user!.id)
    .eq("status", "published");

  const { count: drafts } = await supabase
    .from("poems")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user!.id)
    .eq("status", "draft");

  const { count: likesReceived } = await supabase
    .from("likes")
    .select("poem_id, poems!inner(author_id)", { count: "exact", head: true })
    .eq("poems.author_id", user!.id);

  const stats = [
    { label: "Poemas publicados", value: published ?? 0 },
    { label: "Rascunhos", value: drafts ?? 0 },
    { label: "Curtidas recebidas", value: likesReceived ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl">Seu painel</h1>
        <p className="text-sm text-muted-foreground">Um resumo do seu acervo.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="font-mono text-xs font-normal uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-3xl tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button asChild className="w-fit">
        <Link href="/dashboard/novo-poema">Escrever um novo poema</Link>
      </Button>
    </div>
  );
}
