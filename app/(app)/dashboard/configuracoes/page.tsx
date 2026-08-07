import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl">Configurações</h1>
      <div className="max-w-md rounded-md border border-border p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          E-mail da conta
        </p>
        <p className="mt-1">{user?.email}</p>
      </div>
      <form action={signOut}>
        <Button variant="outline" type="submit">
          Sair da conta
        </Button>
      </form>
    </div>
  );
}
