import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PoemCard, type PoemCardData } from "@/components/poem/poem-card";
import { FollowButton } from "@/components/profile/follow-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: rawUsername } = await params;
  const username = decodeURIComponent(rawUsername).replace(/^@/, "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, banner_url, social_links")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const [{ data: poems }, { data: collections }, { count: followerCount }, { data: myFollow }] =
    await Promise.all([
      supabase
        .from("poems")
        .select("slug, title, excerpt, reading_time_seconds, published_at")
        .eq("author_id", profile.id)
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase
        .from("collections")
        .select("id, title, slug")
        .eq("author_id", profile.id)
        .eq("is_public", true),
      supabase
        .from("follows")
        .select("follower_id", { count: "exact", head: true })
        .eq("following_id", profile.id),
      user
        ? supabase
            .from("follows")
            .select("follower_id")
            .eq("follower_id", user.id)
            .eq("following_id", profile.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const poemsWithAuthor: PoemCardData[] = (poems ?? []).map((p) => ({
    ...p,
    author: { username: profile.username, display_name: profile.display_name },
  }));

  const instagram = (profile.social_links as Record<string, string> | null)?.instagram;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16">
      <div className="h-40 w-full rounded-md bg-secondary" style={{
        backgroundImage: profile.banner_url ? `url(${profile.banner_url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      <div className="-mt-10 flex items-end justify-between px-2">
        <Avatar className="size-20 border-4 border-background">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.display_name} />
          <AvatarFallback className="font-serif text-xl">
            {profile.display_name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        {user && user.id !== profile.id && (
          <FollowButton
            targetUserId={profile.id}
            profilePath={`/@${profile.username}`}
            isFollowing={Boolean(myFollow)}
          />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h1 className="font-serif text-2xl">{profile.display_name}</h1>
        <p className="font-mono text-xs text-muted-foreground">
          @{profile.username} · {followerCount ?? 0} seguidores · {poemsWithAuthor.length} poemas
        </p>
        {profile.bio && <p className="mt-2 max-w-prose text-sm">{profile.bio}</p>}
        {instagram && (
          <Button variant="link" size="sm" className="w-fit px-0" asChild>
            <a href={`https://instagram.com/${instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">
              @{instagram.replace(/^@/, "")} no Instagram
            </a>
          </Button>
        )}
      </div>

      <Tabs defaultValue="poemas" className="mt-8">
        <TabsList>
          <TabsTrigger value="poemas">Poemas</TabsTrigger>
          <TabsTrigger value="colecoes">Coleções</TabsTrigger>
        </TabsList>
        <TabsContent value="poemas">
          {poemsWithAuthor.length > 0 ? (
            poemsWithAuthor.map((poem) => <PoemCard key={poem.slug} poem={poem} />)
          ) : (
            <p className="py-6 text-sm text-muted-foreground">Nenhum poema publicado ainda.</p>
          )}
        </TabsContent>
        <TabsContent value="colecoes">
          {collections && collections.length > 0 ? (
            <div className="flex flex-col gap-1 py-4">
              {collections.map((c) => (
                <Link
                  key={c.id}
                  href={`/@${profile.username}/colecoes/${c.slug}`}
                  className="border-b border-border py-3 font-serif text-lg hover:text-primary"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-6 text-sm text-muted-foreground">Nenhuma coleção pública ainda.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
