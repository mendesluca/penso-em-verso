-- View count: incremento atômico via RPC, chamado a partir da página pública do poema.
-- SECURITY DEFINER porque o UPDATE em poems é restrito por RLS ao autor (author_id =
-- auth.uid()); aqui liberamos, de forma controlada, só o incremento de view_count em
-- poemas publicados, para qualquer visitante (inclusive anônimo).
create or replace function public.increment_poem_view(poem_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.poems
  set view_count = view_count + 1
  where id = poem_id and status = 'published';
$$;

grant execute on function public.increment_poem_view(uuid) to anon, authenticated;
