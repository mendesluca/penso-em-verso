import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface AuthorPoemRowData {
  id: string;
  title: string;
  status: "draft" | "published";
  updated_at: string;
}

export function AuthorPoemRow({ poem }: { poem: AuthorPoemRowData }) {
  return (
    <Link
      href={`/dashboard/poemas/${poem.id}/editar`}
      className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-none hover:text-primary"
    >
      <span className="font-serif text-lg">{poem.title}</span>
      <span className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <Badge variant={poem.status === "published" ? "default" : "secondary"}>
          {poem.status === "published" ? "publicado" : "rascunho"}
        </Badge>
        {new Date(poem.updated_at).toLocaleDateString("pt-BR")}
      </span>
    </Link>
  );
}
