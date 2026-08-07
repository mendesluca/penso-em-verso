import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = { title: "Novos autores" };

export default async function NovosAutoresPage() {
  const supabase = await createClient();

  const { data: authors } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-3xl">Novos autores</h1>
      <p className="mt-2 text-muted-foreground">Quem chegou recentemente à comunidade.</p>
      <div className="mt-10 flex flex-col gap-4">
        {authors?.map((a) => (
          <Link
            key={a.username}
            href={`/@${a.username}`}
            className="flex items-center gap-4 border-b border-border py-4 last:border-none hover:text-primary"
          >
            <Avatar>
              <AvatarImage src={a.avatar_url ?? undefined} alt={a.display_name} />
              <AvatarFallback className="font-serif">{a.display_name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-serif text-lg">{a.display_name}</p>
              <p className="font-mono text-xs text-muted-foreground">@{a.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
