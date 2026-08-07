import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data: poems } = await supabase
    .from("poems")
    .select("slug, updated_at, author:profiles!poems_author_id_fkey(username)")
    .eq("status", "published");

  const { data: profiles } = await supabase.from("profiles").select("username, updated_at");

  const poemEntries: MetadataRoute.Sitemap = (poems ?? []).flatMap((poem) => {
    const author = Array.isArray(poem.author) ? poem.author[0] : poem.author;
    if (!author) return [];
    return [
      {
        url: `${base}/@${author.username}/${poem.slug}`,
        lastModified: poem.updated_at,
      },
    ];
  });

  const profileEntries: MetadataRoute.Sitemap = (profiles ?? []).map((profile) => ({
    url: `${base}/@${profile.username}`,
    lastModified: profile.updated_at,
  }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/descubra`, lastModified: new Date() },
    ...profileEntries,
    ...poemEntries,
  ];
}
