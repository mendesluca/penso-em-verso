import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Troca o código de autenticação (OAuth do Google ou link de recuperação de senha)
// por uma sessão válida.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?erro=callback`);
}
