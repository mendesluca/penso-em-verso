import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatReadingTime } from "@/lib/text/poem";
import { PoemActions } from "@/components/poem/poem-actions";
import { CommentForm } from "@/components/poem/comment-form";
import { ViewTracker } from "@/components/poem/view-tracker";

async function getPoem(username: string, slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("poems")
    .select(
      "id, title, content, excerpt, reading_time_seconds, published_at, author:profiles!poems_author_id_fkey!inner(id, username, display_name, bio)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("author.username", username)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  const poem = await getPoem(decodeURIComponent(username).replace(/^@/, ""), slug);
  if (!poem) return {};

  const author = Array.isArray(poem.author) ? poem.author[0] : poem.author;
  const title = `${poem.title} — ${author.display_name}`;
  const description = poem.excerpt ?? poem.content.slice(0, 155);

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username: rawUsername, slug } = await params;
  const username = decodeURIComponent(rawUsername).replace(/^@/, "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const poem = await getPoem(username, slug);
  if (!poem) notFound();

  const author = Array.isArray(poem.author) ? poem.author[0] : poem.author;
  const poemPath = `/@${username}/${slug}`;
  const isOwnPoem = user?.id === author.id;

  const [{ count: likeCount }, { data: myLike }, { data: myFavorite }, { data: comments }] =
    await Promise.all([
      supabase.from("likes").select("user_id", { count: "exact", head: true }).eq("poem_id", poem.id),
      user
        ? supabase.from("likes").select("user_id").eq("poem_id", poem.id).eq("user_id", user.id).maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from("favorites")
            .select("user_id")
            .eq("poem_id", poem.id)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("comments")
        .select("id, content, created_at, author:profiles(username, display_name)")
        .eq("poem_id", poem.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true }),
    ]);

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      {!isOwnPoem && <ViewTracker poemId={poem.id} />}
      <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {poem.published_at &&
          new Date(poem.published_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}{" "}
        · {formatReadingTime(poem.reading_time_seconds)}
      </p>
      <h1 className="text-balance font-serif text-4xl leading-tight">{poem.title}</h1>
      <Link
        href={`/@${author.username}`}
        className="mt-2 inline-block font-mono text-sm text-muted-foreground hover:text-primary"
      >
        por {author.display_name}
      </Link>

      <div className="mt-10 whitespace-pre-line font-serif text-lg leading-loose text-balance">
        {poem.content}
      </div>

      <div className="mt-10">
        <PoemActions
          poemId={poem.id}
          poemPath={poemPath}
          likeCount={likeCount ?? 0}
          isLiked={Boolean(myLike)}
          isFavorited={Boolean(myFavorite)}
          canInteract={Boolean(user)}
        />
      </div>

      {author.bio && (
        <div className="mt-10 rounded-md border border-border p-6">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Sobre o autor
          </p>
          <p className="mt-2 text-sm">{author.bio}</p>
        </div>
      )}

      <section className="mt-10 flex flex-col gap-6">
        <h2 className="font-serif text-xl">Comentários</h2>
        {user ? (
          <CommentForm poemId={poem.id} poemPath={poemPath} />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary underline">
              Entre
            </Link>{" "}
            para comentar.
          </p>
        )}
        <div className="flex flex-col gap-4">
          {(comments ?? []).map((comment) => {
            const commentAuthor = Array.isArray(comment.author) ? comment.author[0] : comment.author;
            return (
              <div key={comment.id} className="border-b border-border pb-4">
                <p className="font-mono text-xs text-muted-foreground">
                  {commentAuthor?.display_name} ·{" "}
                  {new Date(comment.created_at).toLocaleDateString("pt-BR")}
                </p>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
