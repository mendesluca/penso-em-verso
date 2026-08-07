import Link from "next/link";
import { formatReadingTime } from "@/lib/text/poem";

export interface PoemCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  reading_time_seconds: number;
  published_at: string | null;
  author: { username: string; display_name: string } | null;
}

export function PoemCard({ poem }: { poem: PoemCardData }) {
  if (!poem.author) return null;

  return (
    <Link
      href={`/@${poem.author.username}/${poem.slug}`}
      className="group flex flex-col gap-2 border-b border-border py-6 first:pt-0 last:border-none"
    >
      <h3 className="font-serif text-xl leading-snug group-hover:text-primary transition-colors text-balance">
        {poem.title}
      </h3>
      {poem.excerpt && (
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {poem.excerpt}
        </p>
      )}
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
        {poem.author.display_name} · {formatReadingTime(poem.reading_time_seconds)}
      </p>
    </Link>
  );
}
