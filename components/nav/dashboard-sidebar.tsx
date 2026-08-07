import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/dashboard", label: "Painel" },
  { href: "/dashboard/novo-poema", label: "Novo poema" },
  { href: "/dashboard/poemas", label: "Meus poemas" },
  { href: "/dashboard/rascunhos", label: "Rascunhos" },
  { href: "/dashboard/estatisticas", label: "Estatísticas" },
  { href: "/dashboard/colecoes", label: "Coleções" },
  { href: "/dashboard/curtidos", label: "Curtidos" },
  { href: "/dashboard/salvos", label: "Salvos" },
  { href: "/dashboard/perfil", label: "Perfil" },
  { href: "/dashboard/configuracoes", label: "Configurações" },
];

export function DashboardSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-border p-6 md:w-56 md:border-b-0 md:border-r md:p-8">
      <Link href="/" className="font-serif text-lg">
        Penso em <em className="text-primary not-italic">Verso</em>
      </Link>
      <nav className="flex flex-col gap-1 font-mono text-xs uppercase tracking-wide">
        {links.map((link) => (
          <Button key={link.href} variant="ghost" size="sm" className="justify-start" asChild>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto flex items-center justify-between">
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="font-mono text-xs uppercase">
            Sair
          </Button>
        </form>
        <ThemeToggle />
      </div>
    </aside>
  );
}
