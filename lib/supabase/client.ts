import { createBrowserClient } from "@supabase/ssr";

// Cliente para uso em Client Components. Usa a publishable key — RLS decide o que é acessível.
//
// Não parametrizado com o tipo `Database` de ./types: esses tipos foram escritos à mão a
// partir da migration e não incluem metadados de relacionamento (Relationships) que o
// PostgREST usa para tipar joins (`profiles(username, ...)`). Ao trocar para um projeto
// Supabase real, gere os tipos oficiais (`supabase gen types typescript`) e volte a
// parametrizar os clientes para reganhar type-safety completa nas queries.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
