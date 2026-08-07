import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com a secret key — ignora RLS. Uso restrito a Route Handlers/Edge Functions
// que processam webhooks (Stripe) ou tarefas privilegiadas (agregação de views, etc).
// Nunca importar este módulo em código que roda no navegador.
//
// Não parametrizado com `Database` (ver nota em ./client.ts) — regenerar tipos oficiais
// ao conectar a um projeto Supabase real.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
}
