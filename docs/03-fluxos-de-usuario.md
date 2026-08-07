# Fluxos de Usuário

## 1. Cadastro e onboarding (autor vindo do WhatsApp)

1. Landing page → "Criar minha conta" (ou "Entrar com Google").
2. Cadastro: nome, e-mail, senha (ou OAuth Google) → confirmação de e-mail.
3. Onboarding curto (3 passos, pulável):
   1. Escolher `@usuario` (com verificação de disponibilidade em tempo real).
   2. Foto de perfil + bio curta (opcional).
   3. "Importar seu primeiro poema" — CTA direto para o editor, texto placeholder incentivando
      colar um poema que já escreveu.
4. Cai no Dashboard com um rascunho já iniciado.

*Objetivo do onboarding: sair do cadastro com pelo menos um rascunho criado — reduz o "cadastrei
e nunca voltei".*

## 2. Publicar um poema

1. Dashboard → "Novo poema".
2. Editor: título, conteúdo, categoria, tags (livres + sentimento), capa opcional.
3. Salvar como rascunho (auto-save a cada poucos segundos) a qualquer momento.
4. "Publicar" → confirmação (poema passa a ter URL pública e aparece no perfil/feed) →
   tela de sucesso com o link pronto para compartilhar no WhatsApp/Instagram.
5. Editar poema publicado é permitido a qualquer momento (mesma URL/slug preservado).

## 3. Leitor descobre e lê um poema

1. Chega via link direto (WhatsApp/Instagram/Google) ou via `/descubra`.
2. Página do poema: leitura sem login necessário.
3. Ações que pedem login apenas no momento do clique (curtir, favoritar, comentar, seguir) —
   nunca um paywall de cadastro antes de ler.
4. Ao curtir/favoritar sem estar logado → modal leve de login/cadastro, retorna para a mesma
   página após autenticar (sem perder o contexto).

## 4. Criar uma coleção

1. Dashboard → "Coleções" → "Nova coleção" (título, descrição, capa, pública/privada).
2. Adicionar poemas existentes à coleção (drag-and-drop ou seleção em lista) e ordenar.
3. Coleção pública aparece no perfil do autor como uma "prateleira".

## 5. Seguir autores e feed (V2)

1. No perfil de um autor → "Seguir".
2. Aba "Seguindo" no dashboard mostra feed cronológico apenas de quem o usuário segue —
   nunca um feed algorítmico geral (mantém a filosofia "biblioteca, não rede social").
3. Notificação (sino) quando autor seguido publica.

## 6. Busca

1. Campo de busca no header → resultados combinam poemas (título/conteúdo), autores
   (nome/@usuário), tags e categorias, com abas para filtrar por tipo.
2. Busca por sentimento é uma navegação separada (`/sentimentos/[slug]`), não faz parte da
   busca textual — é descoberta editorial, não full-text.

## 7. Fluxo de compra no marketplace (V2/monetização)

1. Loja do autor acessível a partir do perfil (`/@usuario/loja`).
2. Leitor escolhe produto → checkout (Stripe) → e-mail de confirmação.
3. eBook: link de download assinado (expira) enviado por e-mail e disponível em
   "Minhas compras".
4. Produto físico: pedido registrado, fulfillment é responsabilidade do autor (ou de um
   parceiro de print-on-demand integrado futuramente) — a plataforma processa pagamento e
   retém comissão automaticamente via Stripe Connect.

## 8. Dashboard de estatísticas do autor

1. Autor acessa "Estatísticas" no dashboard.
2. Visão geral: views, leituras completas, curtidas, favoritos, compartilhamentos,
   seguidores, crescimento (gráfico de 30/90 dias).
3. Por poema: tempo médio de leitura, taxa de conclusão, poemas mais populares no período.
