# Design e UI/UX

## Princípios

1. **O texto é o herói.** Nenhum elemento de UI deve competir visualmente com o poema.
2. **Silêncio visual.** Sem badges piscando, sem contadores em vermelho berrante, sem
   auto-play de nada.
3. **Espaço em branco generoso.** Margens largas, `line-height` alto no corpo do poema
   (1.7–1.9), largura de coluna limitada (~65ch) para conforto de leitura.
4. **Modo claro e escuro tratados como igualmente "principais"**, não um sendo afterthought
   do outro — o modo escuro remete a "ler à noite com luz de mesa", não a "tema hacker".

## Tipografia

| Uso | Fonte sugerida | Motivo |
|---|---|---|
| Corpo do poema | Serifada literária — **Fraunces** ou **Lora** | Remete a livro impresso, boa legibilidade em texto longo |
| UI (botões, menus, labels) | Sans neutra — **Inter** ou **Manrope** | Funcional, não compete com a serifada |
| Títulos de poema | Mesma serifada do corpo, peso maior | Mantém unidade "página de livro" |

## Paleta (referência inicial — ajustar com identidade final)

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `background` | `#FAF7F0` (papel) | `#15130F` (tinta) | Fundo geral |
| `foreground` | `#1F1B16` | `#F2EEE4` | Texto principal |
| `muted` | `#8A8272` | `#8A8272` | Texto secundário, metadados |
| `accent` | `#7A2E2E` (bordô) *ou* `#3E5C4A` (verde-mata) | mesmo tom, ajustado em luminosidade | Links, CTA, tags de sentimento |
| `border` | `#E4DECE` | `#2A251E` | Divisores sutis |

Um único acento de cor — evita "cara de app colorido". Estados de sentimento (tags) podem
usar pequenas variações tonais do próprio acento em vez de uma paleta arco-íris.

## Componentes (mapeados para shadcn/ui)

- `Button` (variante `ghost`/`link` para ações secundárias como curtir/favoritar — ícone +
  contador discreto, não botão cheio).
- `Card` para poema em destaque, autor em destaque, produto da loja.
- `Avatar`, `Tabs` (perfil: Poemas / Coleções / Sobre), `Sheet` (menu mobile), `Dialog`
  (confirmar publicação, login inline), `DropdownMenu` (editar/excluir poema), `Textarea`
  autoexpansível (editor), `Toast` (rascunho salvo, poema publicado).
- Ícones de curtir/favoritar/comentar: outline por padrão, preenchido só no estado ativo —
  nunca cor de alerta (vermelho vibrante) a menos que seja o próprio acento da marca.

## Wireframes (descrição estrutural)

### Landing page
```
[Header: logo | Descobrir | Sobre | Entrar | Criar conta]
[Hero: frase de impacto + imagem/ilustração editorial + CTA "Comece a escrever"]
[Poema em destaque — card grande, tipografia do poema já visível, não só uma thumbnail]
[Últimos poemas — grid 3 col desktop / 1 col mobile, cada card: capa opcional, título, autor, trecho]
[Autores em destaque — carrossel de avatares + bio curta]
[Categorias — chips/cards: Poesia, Haicai, Soneto, Crônica...]
[CTA final: "Sua obra merece um lar permanente" + Criar conta]
[Footer: sobre, contato, redes sociais, termos]
```

### Perfil do autor (`/@usuario`)
```
[Banner]
[Avatar sobreposto | Nome | @usuario | Seguir (se logado e não for o próprio) ]
[Bio | links sociais]
[Estatísticas básicas públicas: nº poemas, nº seguidores]
[Tabs: Poemas | Coleções | Sobre | (Loja, se v2 ativo)]
[Grid/lista de poemas — ordenável por recentes/populares]
```

### Página do poema (`/@usuario/slug`)
```
[Categoria/tag no topo, discreta]
[Título — tipografia grande, serifada]
[Autor (avatar + nome) | data | tempo de leitura]
[Conteúdo do poema — coluna centralizada, largura limitada, respiro entre estrofes]
[Barra de ações discreta: curtir · favoritar · comentar · compartilhar]
[Sobre o autor — card curto com link para o perfil]
[Comentários]
[Mais poemas deste autor / poemas relacionados por tag]
```

### Editor
```
[Barra superior: Rascunho salvo às 14:32 | Publicar]
[Campo título — grande, sem borda, placeholder "Título do poema"]
[Área de conteúdo — textarea estilizada como página, fonte serifada em tempo real (WYSIWYG leve)]
[Painel lateral (colapsável): Categoria | Tags | Capa | Visibilidade]
```

### Dashboard
```
[Sidebar: Novo poema | Meus poemas | Rascunhos | Coleções | Estatísticas | Perfil | Configurações]
[Conteúdo principal muda conforme item selecionado — listas simples, sem gráficos poluídos]
```

## Acessibilidade

- Contraste mínimo AA em todos os tokens de cor (validar claro e escuro).
- Navegação por teclado completa no editor e nos componentes shadcn/ui (já vêm com Radix,
  que cobre a maior parte disso).
- `alt` obrigatório em capas/avatars; página do poema com hierarquia de headings correta
  (`h1` = título do poema) para leitores de tela e SEO simultaneamente.
