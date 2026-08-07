const WORDS_PER_MINUTE = 200;

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function readingTimeSeconds(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(20, Math.round((words / WORDS_PER_MINUTE) * 60));
}

export function formatReadingTime(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min de leitura`;
}

export function excerptFrom(content: string, maxLength = 160): string {
  const flat = content.replace(/\s+/g, " ").trim();
  if (flat.length <= maxLength) return flat;
  return flat.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}
