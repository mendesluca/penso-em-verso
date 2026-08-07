import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg">
          Penso em <em className="text-primary not-italic">Verso</em>
        </Link>
        <nav className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/descubra">Descobrir</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/busca">Buscar</Link>
          </Button>
          <ThemeToggle />
          {user ? (
            <Button size="sm" asChild>
              <Link href="/dashboard">Painel</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
