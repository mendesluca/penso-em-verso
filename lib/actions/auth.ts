"use server";

import { redirect } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sanitizeUsername } from "@/lib/text/username";

export type ActionState = { error: string | null; info?: string | null };

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

// O Supabase retorna mensagens de erro em inglês, direto da API — nunca repassamos
// esse texto cru pro usuário. Mapeamos os códigos conhecidos e caímos num genérico
// pt-BR pra qualquer coisa que não reconhecemos.
function translateAuthError(
  error: AuthError,
  fallback = "Não foi possível concluir agora. Tente novamente em instantes.",
): string {
  const code = error.code ?? "";
  const message = error.message.toLowerCase();

  if (code === "user_already_exists" || message.includes("already registered")) {
    return "Este e-mail já está cadastrado. Tente entrar ou recuperar sua senha.";
  }
  if (code === "weak_password" || message.includes("password")) {
    return "Senha muito fraca — use pelo menos 6 caracteres.";
  }
  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.";
  }
  if (code === "email_not_confirmed") {
    return "Confirme seu e-mail antes de entrar — verifique sua caixa de entrada.";
  }
  if (code === "invalid_credentials") {
    return "E-mail ou senha inválidos.";
  }
  return fallback;
}

export async function signUp(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "");
  const usernameInput = String(formData.get("username") ?? "");
  const username = sanitizeUsername(usernameInput || displayName).slice(0, 30);

  if (!email || !password || !displayName || username.length < 3) {
    return { error: "Preencha nome, @usuário (mín. 3 caracteres), e-mail e senha." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, username },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard/novo-poema`,
    },
  });

  if (error) return { error: translateAuthError(error) };

  // Com confirmação de e-mail habilitada no Supabase, signUp() não cria sessão —
  // só o link no e-mail (via /auth/callback) faz isso. Sem essa checagem, o usuário
  // era jogado para /dashboard e batia no guard de auth, caindo de volta em /login
  // sem nenhuma explicação.
  if (!data.session) {
    return {
      error: null,
      info: `Enviamos um link de confirmação para ${email}. Clique nele para ativar sua conta.`,
    };
  }

  redirect("/dashboard/novo-poema");
}

export async function signIn(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: translateAuthError(error, "E-mail ou senha inválidos.") };

  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error || !data.url) redirect("/login?erro=google");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard/configuracoes`,
  });

  if (error) return { error: translateAuthError(error) };
  return { error: null };
}
