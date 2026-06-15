# Honor Growth — Site

Site institucional da Honor Growth (honor-growth.com). Landing page B2B para consultoria de vendas e IA.

## Stack

- HTML estático (sem build step)
- CSS custom (`assets/utilities.css` — subset de Tailwind hand-rolled)
- Hosting: Cloudflare (auto-deploy via GitHub, branch `main`)

## Estrutura

| Ficheiro | Descrição |
|---|---|
| `index.html` | Landing page principal (~2200 linhas) |
| `lp.html` | Landing page para ads (sem equipa, sem VSL nos testemunhos) |
| `analytics.html` | Dashboard público Umami (iframe) |
| `privacidade.html` | Política de privacidade |
| `cookies.html` | Política de cookies |
| `termos.html` | Termos e condições |
| `assets/` | Fotos, vídeos, logos, CSS |

## Tracking

| Ferramenta | Onde | Para quê |
|---|---|---|
| Meta Pixel (`736478694950337`) | index.html, lp.html | PageView, retargeting |
| Umami Analytics | index.html, lp.html | Visitas, eventos, UTMs |
| CAPI (Conversions API) | GoHighLevel (painel) | Eventos server-side para Meta |

### Eventos Umami

- `cta_click` — clique num botão CTA (#contacto)
- `video_play` — play num vídeo de testemunho
- `vsl_play` — play no VSL principal
- `generate_lead` — submissão do formulário GHL

### Dashboard

- Público: https://cloud.umami.is/share/1aqkTcOxWkfHA5Bp
- No site: `analytics.html` (atalho Ctrl+M em qualquer página)

## Formulário de contacto

Iframe do GoHighLevel (form ID `eQoZuhMtktMEHwP0Pxty`). O script `form_embed.js` passa UTMs da página pai para o iframe automaticamente.

O CAPI token do Meta configura-se no painel do GHL (Settings > Integrations > Facebook), não no código.

## Equipa

Definida no array `team` em `index.html`. Para adicionar um membro:

```js
{ name: "Nome", role: "Cargo", photo: "assets/foto.jpg" }
```

## Notas

- `assets/utilities.css` — não reformatar/reordenar. Alterações de whitespace podem partir o site.
- O JS principal corre numa IIFE — não redeclarar variáveis `const` já existentes (ex: `vslPlaceholder`), senão todo o JS falha.
- Cloudflare faz cache agressivo — depois de push, pode demorar até 2 min a atualizar. Usar `curl` para confirmar.

## Changelog

### 2026-06-15
- Adicionado Meta Pixel e Umami Analytics (substituiu GA4)
- Formulário de contacto substituído por iframe GoHighLevel
- Eventos custom Umami (cta_click, video_play, vsl_play, generate_lead)
- Página `analytics.html` com dashboard público Umami
- Atalho Ctrl+M para abrir analytics
- Novos membros da equipa: Carlos (AI Voice & Text Agent), William Fox (Cold Caller), Rodrigo Correia (Software Engineer)
