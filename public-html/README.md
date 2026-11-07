# Compras Já — site institucional estático (`public-html`)

HTML/CSS puro para publicar no **GitHub Pages** ou fazer deploy estático (Hostinger, Netlify, etc.).

## Conteúdo

- `index.html` — homepage
- `pages/` — páginas institucionais
- `css/styles.css` — design system
- `assets/` — logos SVG (incluindo `logo-github.svg` para avatar do GitHub)
- `favicon.svg`

## Publicar no GitHub Pages

1. Faça merge deste branch / envie a pasta `public-html` para o repositório.
2. Em **Settings → Pages**:
   - Source: **GitHub Actions** (workflow incluso em `.github/workflows/pages.yml`)
   - Ou: Deploy from branch → pasta `/public-html` (se disponível no plano)
3. URL típica após ativar:

`https://<org>.github.io/<repo>/`

Exemplo deste repo: `https://plentyengenharia.github.io/comprasja/`

## Testar localmente

Abra `index.html` no navegador ou sirva a pasta:

```bash
cd public-html && python3 -m http.server 8080
```

## Deploy Hostinger (estático)

Compacte o **conteúdo** de `public-html` (com `index.html` na raiz do zip) e use deploy estático.