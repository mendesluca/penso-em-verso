import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Estatísticas" };

export default async function EstatisticasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: poems } = await supabase
    .from("poems")
    .select("id, title, status, view_count, published_at, likes(count), comments(count)")
    .eq("author_id", user.id)
    .order("view_count", { ascending: false });

  const rows = (poems ?? []).map((poem) => ({
    id: poem.id,
    title: poem.title,
    status: poem.status,
    views: poem.view_count,
    likes: Array.isArray(poem.likes) ? (poem.likes[0]?.count ?? 0) : 0,
    comments: Array.isArray(poem.comments) ? (poem.comments[0]?.count ?? 0) : 0,
  }));

  const totals = rows.reduce(
    (acc, r) => ({
      views: acc.views + r.views,
      likes: acc.likes + r.likes,
      comments: acc.comments + r.comments,
    }),
    { views: 0, likes: 0, comments: 0 },
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl">Estatísticas</h1>
        <p className="text-sm text-muted-foreground">Como seus poemas estão indo.</p>
      </div>

      {rows.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Visualizações", value: totals.views },
              { label: "Curtidas", value: totals.likes },
              { label: "Comentários", value: totals.comments },
            ].map((stat) => (
              <div key={stat.label} className="rounded-md border border-border p-4">
                <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 font-serif text-2xl tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4">Poema</th>
                  <th className="py-2 pr-4 text-right">Views</th>
                  <th className="py-2 pr-4 text-right">Curtidas</th>
                  <th className="py-2 text-right">Comentários</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border">
                    <td className="py-3 pr-4">
                      <span className="font-serif">{row.title}</span>
                      {row.status === "draft" && (
                        <Badge variant="secondary" className="ml-2">
                          rascunho
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">{row.views}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{row.likes}</td>
                    <td className="py-3 text-right tabular-nums">{row.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Publique um poema para começar a ver estatísticas.
        </p>
      )}
    </div>
  );
}
