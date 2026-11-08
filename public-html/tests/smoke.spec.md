# Smoke checks — Entrega A (`public-html`)

Rodar localmente (sem deploy):

```bash
python3 -m http.server 8765 --directory public-html
```

## Checklist manual / Playwright

1. Em viewport &lt; 1024px: botão “Abrir menu” aparece; `Esc` e clique fora fecham o drawer; foco permanece no toggle ao fechar.
2. Em ≥ 1024px: links da nav ficam na barra; drawer oculto.
3. Footer: logo clara (`logo-mark-light.png`) legível no fundo escuro.
4. Homepage: CTAs “Ver demonstração” / “Falar com a equipe”; badge “Demonstração” no hero.
5. `/pages/login.html` e `/pages/cadastro.html`: `noindex` no meta robots.
6. `/pages/contato.html`: formulário abre `mailto:` com assunto/corpo preenchidos.
7. Head: `canonical`, `og:*`, `twitter:card` presentes; `/sitemap.xml` e `/robots.txt` respondem 200.

## Playwright (local)

```bash
cd public-html/tests
npm init -y
npm install @playwright/test@1.49.0
npx playwright install chromium
npx playwright test -c playwright.config.mjs
```

Esperado: 9 testes passando (viewports 320–1440, CTAs, contato, noindex).
