# SEO e Descoberta

## SEO técnico por poema

- **URL amigável e permanente:** `/@usuario/slug-do-poema` — slug gerado do título, editável
  antes da primeira publicação, fixo depois (evita quebrar links já compartilhados).
- **`generateMetadata` por página:**
  - `title`: `"{título} — {autor} | Penso em Verso"`
  - `description`: excerpt (custom ou primeiras ~155 caracteres do poema)
  - `canonical`: URL absoluta do poema
  - Open Graph: `og:title`, `og:description`, `og:image` (gerada dinamicamente), `og:type=article`
  - Twitter Card: `summary_large_image`
- **Dados estruturados (JSON-LD)** usando schema.org `CreativeWork`:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Título do poema",
    "author": { "@type": "Person", "name": "Nome do autor" },
    "datePublished": "2026-08-07",
    "genre": "Poesia",
    "text": "..."
  }
  ```
- **`sitemap.ts`** (App Router) gera entradas para todos os poemas `published`, perfis e
  coleções públicas, com `lastmod` = `updated_at`.
- **`robots.ts`** libera crawl de páginas públicas, bloqueia `/dashboard`, `/configuracoes`.
- **Heading hierarchy:** `h1` único = título do poema; nome do autor e metadados como texto
  secundário, não heading.
- **Performance como fator de SEO:** ISR + imagens otimizadas (`next/image`) mantêm Core Web
  Vitals bons, o que o Google usa como sinal de ranking.

## Páginas de descoberta

| Página | Rota | Critério |
|---|---|---|
| Poemas do dia | `/descubra` | Curadoria editorial ou rotação diária automática entre poemas recentes de qualidade (definir critério: curtidas/tempo desde publicação) |
| Em alta | `/em-alta` | Ranking por engajamento (curtidas + favoritos + views) na última semana |
| Novos autores | `/novos-autores` | Perfis criados nos últimos 30 dias com ao menos 1 poema publicado |
| Mais lidos | `/mais-lidos` | Ranking por `view_count` acumulado (all-time e período) |
| Categorias | `/categorias/[slug]` | Poemas filtrados por `category_id` |
| Sentimentos | `/sentimentos/[slug]` | Poemas com tag `type='sentimento'` correspondente (Melancolia, Esperança, Amor, Saudade, Solidão, Natureza, Existencialismo) |

Cada página de descoberta é também indexável (título/descrição próprios) — vira porta de
entrada de SEO adicional (ex.: "poemas sobre saudade" como busca no Google apontando direto
para `/sentimentos/saudade`).

## Busca interna

- MVP: `to_tsvector('portuguese', ...)` sobre `poems.title` e `poems.content`, com peso maior
  em título (`setweight 'A'` vs `'B'`, ver [[02-banco-de-dados]]).
- Filtros combináveis: tipo de resultado (poema/autor), categoria, tag.
- V2+: migrar para Meilisearch/Typesense quando o volume justificar busca fuzzy/typo-tolerant
  e relevância mais sofisticada (ex.: ponderar popularidade do poema no ranking de busca).
