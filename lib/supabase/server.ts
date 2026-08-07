import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente para uso em Server Components / Server Actions / Route Handlers.
// Propaga a sessão do usuário via cookies — RLS decide o que é acessível.
//
// Não parametrizado com `Database` (ver nota em ./client.ts) — regenerar tipos oficiais
// ao conectar a um projeto Supabase real.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // chamado a partir de um Server Component (sem permissão de escrita);
            // o proxy.ts cuida de manter a sessão atualizada nesses casos.
          }
        },
      },
    },
  );
}
