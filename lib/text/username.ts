// Separado de poem.ts: convenção de @usuário usa underscore ("maria_poeta"), não hífen
// como os slugs de poema/coleção — por isso não reaproveita slugify().
export function sanitizeUsername(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}
