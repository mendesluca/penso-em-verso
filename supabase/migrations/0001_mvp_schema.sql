-- Penso em Verso — schema MVP
-- Ver docs/02-banco-de-dados.md para o modelo completo e justificativas.

create extension if not exists "citext";
create extension if not exists "pgcrypto";

-- ============================================================================
-- profiles
-- ============================================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      citext unique not null check (char_length(username) between 3 and 30),
  display_name  text not null,
  bio           text,
  avatar_url    text,
  banner_url    text,
  social_links  jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "perfis são públicos"
  on public.profiles for select
  using (true);

create policy "usuário cria seu próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "usuário edita seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- cria automaticamente um profile ao registrar um novo usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'usuario_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- categories
-- ============================================================================
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text
);

alter table public.categories enable row level security;

create policy "categorias são públicas"
  on public.categories for select
  using (true);

insert into public.categories (name, slug, description) values
  ('Poesia', 'poesia', null),
  ('Crônica', 'cronica', null),
  ('Haicai', 'haicai', null),
  ('Soneto', 'soneto', null),
  ('Verso livre', 'verso-livre', null),
  ('Microconto', 'microconto', null);

-- ============================================================================
-- poems
-- ============================================================================
create type public.poem_status as enum ('draft', 'published');

create table public.poems (
  id                    uuid primary key default gen_random_uuid(),
  author_id             uuid not null references public.profiles(id) on delete cascade,
  title                 text not null,
  slug                  text not null,
  content               text not null,
  excerpt               text,
  cover_url             text,
  category_id           uuid references public.categories(id),
  status                public.poem_status not null default 'draft',
  reading_time_seconds  int not null default 0,
  view_count            bigint not null default 0,
  published_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  search_vector         tsvector generated always as (
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(content, '')), 'B')
  ) stored,
  unique (author_id, slug)
);

create index poems_search_idx on public.poems using gin (search_vector);
create index poems_published_idx on public.poems (published_at desc) where status = 'published';
create index poems_author_idx on public.poems (author_id);

alter table public.poems enable row level security;

create policy "poemas publicados são visíveis a todos; rascunhos só ao autor"
  on public.poems for select
  using (status = 'published' or author_id = auth.uid());

create policy "autor cria seus próprios poemas"
  on public.poems for insert
  with check (author_id = auth.uid());

create policy "autor edita seus próprios poemas"
  on public.poems for update
  using (author_id = auth.uid());

create policy "autor apaga seus próprios poemas"
  on public.poems for delete
  using (author_id = auth.uid());

-- ============================================================================
-- tags / poem_tags
-- ============================================================================
create type public.tag_type as enum ('livre', 'sentimento');

create table public.tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type public.tag_type not null default 'livre'
);

alter table public.tags enable row level security;

create policy "tags são públicas"
  on public.tags for select
  using (true);

insert into public.tags (name, slug, type) values
  ('Melancolia', 'melancolia', 'sentimento'),
  ('Esperança', 'esperanca', 'sentimento'),
  ('Amor', 'amor', 'sentimento'),
  ('Saudade', 'saudade', 'sentimento'),
  ('Solidão', 'solidao', 'sentimento'),
  ('Natureza', 'natureza', 'sentimento'),
  ('Existencialismo', 'existencialismo', 'sentimento');

create table public.poem_tags (
  poem_id uuid not null references public.poems(id) on delete cascade,
  tag_id  uuid not null references public.tags(id) on delete cascade,
  primary key (poem_id, tag_id)
);

alter table public.poem_tags enable row level security;

create policy "poem_tags visível se o poema é visível"
  on public.poem_tags for select
  using (
    exists (
      select 1 from public.poems p
      where p.id = poem_id and (p.status = 'published' or p.author_id = auth.uid())
    )
  );

create policy "autor gerencia tags dos próprios poemas"
  on public.poem_tags for all
  using (exists (select 1 from public.poems p where p.id = poem_id and p.author_id = auth.uid()))
  with check (exists (select 1 from public.poems p where p.id = poem_id and p.author_id = auth.uid()));

-- ============================================================================
-- collections / collection_poems
-- ============================================================================
create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  slug        text not null,
  description text,
  cover_url   text,
  is_public   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (author_id, slug)
);

alter table public.collections enable row level security;

create policy "coleções públicas são visíveis a todos; privadas só ao autor"
  on public.collections for select
  using (is_public or author_id = auth.uid());

create policy "autor gerencia suas próprias coleções"
  on public.collections for insert with check (author_id = auth.uid());
create policy "autor edita suas próprias coleções"
  on public.collections for update using (author_id = auth.uid());
create policy "autor apaga suas próprias coleções"
  on public.collections for delete using (author_id = auth.uid());

create table public.collection_poems (
  collection_id uuid not null references public.collections(id) on delete cascade,
  poem_id       uuid not null references public.poems(id) on delete cascade,
  position      int not null default 0,
  primary key (collection_id, poem_id)
);

alter table public.collection_poems enable row level security;

create policy "collection_poems visível se a coleção é visível"
  on public.collection_poems for select
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and (c.is_public or c.author_id = auth.uid())
    )
  );

create policy "autor gerencia poemas das próprias coleções"
  on public.collection_poems for all
  using (exists (select 1 from public.collections c where c.id = collection_id and c.author_id = auth.uid()))
  with check (exists (select 1 from public.collections c where c.id = collection_id and c.author_id = auth.uid()));

-- ============================================================================
-- comments
-- ============================================================================
create table public.comments (
  id                 uuid primary key default gen_random_uuid(),
  poem_id            uuid not null references public.poems(id) on delete cascade,
  author_id          uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id  uuid references public.comments(id) on delete cascade,
  content            text not null check (char_length(content) between 1 and 2000),
  is_deleted         boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index comments_poem_idx on public.comments (poem_id, created_at);

alter table public.comments enable row level security;

create policy "comentários visíveis se o poema é visível"
  on public.comments for select
  using (
    exists (
      select 1 from public.poems p
      where p.id = poem_id and (p.status = 'published' or p.author_id = auth.uid())
    )
  );

create policy "usuário autenticado comenta"
  on public.comments for insert
  with check (author_id = auth.uid());

create policy "autor do comentário edita/apaga"
  on public.comments for update using (author_id = auth.uid());
create policy "autor do comentário apaga"
  on public.comments for delete using (author_id = auth.uid());

-- ============================================================================
-- likes / favorites / follows
-- ============================================================================
create table public.likes (
  poem_id    uuid not null references public.poems(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (poem_id, user_id)
);

alter table public.likes enable row level security;

create policy "curtidas visíveis a todos"
  on public.likes for select using (true);
create policy "usuário curte com sua própria conta"
  on public.likes for insert with check (user_id = auth.uid());
create policy "usuário remove sua própria curtida"
  on public.likes for delete using (user_id = auth.uid());

create table public.favorites (
  poem_id    uuid not null references public.poems(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (poem_id, user_id)
);

alter table public.favorites enable row level security;

create policy "usuário vê seus próprios favoritos"
  on public.favorites for select using (user_id = auth.uid());
create policy "usuário favorita com sua própria conta"
  on public.favorites for insert with check (user_id = auth.uid());
create policy "usuário remove seu próprio favorito"
  on public.favorites for delete using (user_id = auth.uid());

create table public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

alter table public.follows enable row level security;

create policy "follows são públicos"
  on public.follows for select using (true);
create policy "usuário segue com sua própria conta"
  on public.follows for insert with check (follower_id = auth.uid());
create policy "usuário deixa de seguir com sua própria conta"
  on public.follows for delete using (follower_id = auth.uid());

-- ============================================================================
-- storage buckets (avatars, banners, poem-covers são públicos para leitura)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true),
       ('banners', 'banners', true),
       ('poem-covers', 'poem-covers', true)
on conflict (id) do nothing;

create policy "leitura pública dos buckets de mídia"
  on storage.objects for select
  using (bucket_id in ('avatars', 'banners', 'poem-covers'));

create policy "usuário autenticado envia sua própria mídia"
  on storage.objects for insert
  with check (
    bucket_id in ('avatars', 'banners', 'poem-covers')
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "usuário autenticado substitui sua própria mídia"
  on storage.objects for update
  using (
    bucket_id in ('avatars', 'banners', 'poem-covers')
    and auth.uid()::text = (storage.foldername(name))[1]
  );
