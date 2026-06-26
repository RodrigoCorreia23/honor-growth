# Honor Growth — Site

Site institucional da Honor Growth (honor-growth.com). Landing page B2B para consultoria de vendas e IA.

## Stack

- HTML estático (sem build step) — markup, estilo e comportamento separados em ficheiros
- CSS custom (`assets/utilities.css` — subset de Tailwind hand-rolled)
- Hosting: Cloudflare (auto-deploy via GitHub, branch `main`)
- Segurança: security headers via `_headers` (CSP, anti-clickjacking, HSTS) + SRI nos CDNs

## Estrutura

| Ficheiro | Descrição |
|---|---|
| `index.html` | Landing page principal (markup) |
| `lp.html` | Landing page para ads (sem equipa, sem VSL nos testemunhos) |
| `analytics.html` | Dashboard público Umami (iframe) |
| `privacidade.html` · `cookies.html` · `termos.html` | Páginas legais |
| `_headers` | Security headers da Cloudflare (CSP, etc.) |
| `assets/site.css` | CSS partilhado por `index` e `lp` (index é superset; seletores extra são inertes no lp) |
| `assets/{page}.css` | CSS por página (legais + analytics) |
| `assets/meta-pixel.js` | Snippet Meta Pixel (partilhado index/lp) |
| `assets/index.js` · `assets/lp.js` | JS principal de cada landing (IIFE) |
| `assets/legal.js` | JS partilhado pelas 3 páginas legais |
| `assets/` | Fotos, vídeos, logos, CSS, JS |

> Os ficheiros HTML só contêm markup. CSS → `<link>`, JS → `<script src>`. Nada de
> `<style>`/`<script>` inline (exceto atributos `style=` pontuais e os `<script src>` de CDN).

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

Definida no array `team` em `assets/index.js`. Para adicionar um membro:

```js
{ name: "Nome", role: "Cargo", photo: "assets/foto.jpg" }
```

## Notas

- `assets/utilities.css` — não reformatar/reordenar. Alterações de whitespace podem partir o site.
- O JS principal corre numa IIFE (`assets/index.js` / `assets/lp.js`) — não redeclarar variáveis `const` já existentes (ex: `vslPlaceholder`), senão todo o JS falha.
- `assets/site.css` é partilhado por `index` e `lp`. Editar aqui afeta as duas páginas.
- Cloudflare faz cache agressivo — depois de push, pode demorar até 2 min a atualizar. Usar `curl` para confirmar.

### Segurança (`_headers` / CSP)

- A CSP em `_headers` tem uma allowlist explícita das origens externas (Meta, Umami, GHL, jsdelivr, Google Fonts). **Ao adicionar um novo script/iframe/fonte de outro domínio, é preciso adicioná-lo à diretiva certa**, senão o browser bloqueia-o.
- Os CDNs com versão fixa (intl-tel-input `@24.8.2`) têm `integrity` (SRI). Ao subir de versão, recalcular o hash (`openssl dgst -sha384 -binary ficheiro | openssl base64 -A`) e atualizar a versão e o hash em conjunto.
- Se o formulário GHL ou o input de telefone partirem após deploy, abrir DevTools → Console para ver violações de CSP. Para diagnosticar sem bloquear, trocar `Content-Security-Policy:` por `Content-Security-Policy-Report-Only:` no `_headers`.
- **Não existe base de dados nem backend** — "SQL injection" não se aplica a este site. A validação do formulário é responsabilidade do GoHighLevel (server-side, no painel deles).

## Changelog

### 2026-06-26
- Separado CSS e JS inline para `assets/` (markup, estilo e comportamento em ficheiros distintos)
- `_headers` com security headers: CSP, `X-Frame-Options: DENY`, HSTS, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options: nosniff`
- SRI + versão fixa (`@24.8.2`) no intl-tel-input
- Removidos comentários de HTML/CSS/JS

### 2026-06-15
- Adicionado Meta Pixel e Umami Analytics (substituiu GA4)
- Formulário de contacto substituído por iframe GoHighLevel
- Eventos custom Umami (cta_click, video_play, vsl_play, generate_lead)
- Página `analytics.html` com dashboard público Umami
- Atalho Ctrl+M para abrir analytics
- Novos membros da equipa: Carlos (AI Voice & Text Agent), William Fox (Cold Caller), Rodrigo Correia (Software Engineer)
