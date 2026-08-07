# Penso em Verso

A casa da poesia brasileira — uma plataforma para escritores e poetas independentes
construírem um acervo permanente de suas obras, uma identidade autoral própria e,
futuramente, uma fonte de renda.

Nascida de uma comunidade de poetas em um grupo de WhatsApp, este repositório contém a
especificação completa do produto antes da primeira linha de código de aplicação.

## Documentação

| Documento | Conteúdo |
|---|---|
| [docs/00-visao-geral.md](docs/00-visao-geral.md) | Missão, proposta de valor, identidade, personas |
| [docs/01-arquitetura.md](docs/01-arquitetura.md) | Stack, diagrama de sistema, estrutura de pastas |
| [docs/02-banco-de-dados.md](docs/02-banco-de-dados.md) | Schema completo (SQL) + RLS |
| [docs/03-fluxos-de-usuario.md](docs/03-fluxos-de-usuario.md) | Jornadas principais |
| [docs/04-design-ui-ux.md](docs/04-design-ui-ux.md) | Design system + wireframes |
| [docs/05-roadmap.md](docs/05-roadmap.md) | Fases, prioridade, dificuldade, estimativas |
| [docs/06-backlog.md](docs/06-backlog.md) | Backlog em formato de histórias de usuário |
| [docs/07-crescimento-monetizacao.md](docs/07-crescimento-monetizacao.md) | Estratégias de aquisição/retenção e modelos de receita |
| [docs/08-seo-descoberta.md](docs/08-seo-descoberta.md) | SEO técnico e páginas de descoberta |

## Stack

Next.js + TypeScript + Tailwind + shadcn/ui · Supabase (Postgres, Auth, Storage, RLS) · Vercel.

## Como rodar localmente

1. Crie um projeto em [supabase.com](https://supabase.com) (grátis).
2. Rode a migration em `supabase/migrations/0001_mvp_schema.sql` no SQL Editor do projeto
   (ou via `supabase db push` com o [Supabase CLI](https://supabase.com/docs/guides/cli)).
3. Em **Authentication → Providers**, habilite Google OAuth se for usar login com Google
   (client ID/secret do Google Cloud Console).
4. Copie `.env.local.example` para `.env.local` e preencha com as chaves de
   **Project Settings → API Keys** do seu projeto Supabase (`Publishable key` e
   `Secret key` — as versões atuais das antigas `anon`/`service_role`).
5. Instale as dependências e rode o servidor de desenvolvimento:

   ```bash
   npm install
   npm run dev
   ```

6. Acesse `http://localhost:3000`.

## Estrutura do código

- `app/(marketing)` — landing page pública.
- `app/(auth)` — login, cadastro, recuperação de senha.
- `app/(app)/dashboard` — área privada do autor (editor, poemas, coleções, perfil).
- `app/[username]` — perfil público, poema (`/@usuario/slug`) e coleções.
- `app/descubra`, `app/busca` — descoberta e busca.
- `lib/supabase` — clientes Supabase (browser/server/admin) e tipos do banco.
- `lib/actions` — Server Actions (auth, poemas, perfil).
- `supabase/migrations` — schema SQL versionado.

## Status

Scaffold do MVP implementado (auth, editor, dashboard, perfil público, página do poema,
curtir/favoritar/comentar, coleções, busca, páginas de descoberta, SEO básico). Próximos
passos e prioridades em [docs/06-backlog.md](docs/06-backlog.md).
