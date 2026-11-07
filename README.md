# Compras Já

**Compras Já | Plataforma de Licitações Eletrônicas**  
Slogan: *Licitações inteligentes. Oportunidades reais.*

Plataforma SaaS GovTech / ProcurementTech para o mercado brasileiro, alinhada à Lei Federal nº 14.133/2021.

> Domínios são configuráveis. Não há URL de produção afirmada neste repositório.  
> Certames oficiais e publicação PNCP permanecem **desativados** até credenciamento e validação jurídica/técnica.

## Monorepo

| Pacote | Descrição |
|--------|-----------|
| `apps/web` | Next.js — institucional, portais e transparência |
| `apps/api` | NestJS — API REST `/api/v1` + OpenAPI |
| `apps/worker` | BullMQ — jobs assíncronos |
| `packages/ui` | Design system Compras Já |
| `packages/database` | Prisma + PostgreSQL |
| `packages/shared` | Enums, Zod, RBAC, CNPJ alfanumérico |
| `packages/config` | TSConfig / Tailwind preset |
| `infra` | Docker Compose e Dockerfiles |
| `docs` | Documentação técnica |

## Pré-requisitos

- Node.js 20+
- pnpm 10+
- Docker (PostgreSQL + Redis) **ou** instâncias locais equivalentes

## Início rápido

```bash
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d postgres redis
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000/api/v1/health`
- OpenAPI: `http://localhost:4000/api/docs`

### Contas demonstrativas (somente development)

Após o seed (senha `ComprasJa!Demo1`):

- `admin@comprasja.local` — administração SaaS
- `fornecedor@demo.local` — portal fornecedor
- `orgao@demo.local` — portal órgão

## Documentação

- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/DATABASE.md](./docs/DATABASE.md)
- [docs/API.md](./docs/API.md)
- [docs/SECURITY.md](./docs/SECURITY.md)
- [docs/PNCP_INTEGRATION.md](./docs/PNCP_INTEGRATION.md)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- [docs/TESTING.md](./docs/TESTING.md)
- [docs/OPERATIONS.md](./docs/OPERATIONS.md)
- [docs/ROADMAP.md](./docs/ROADMAP.md)
- [docs/RELEASE_READINESS.md](./docs/RELEASE_READINESS.md)

## Marca

Nome de apresentação: **Compras Já**. Não utilizar nomes anteriores (ex.: Procura Cloud) nem identidade visual de concorrentes.

Arquivos para GitHub (avatar / README): pasta [`brand/`](./brand/) — comece por `brand/logo-github.svg`.

## Site estático (`public-html`)

Vitrine institucional em HTML puro para **GitHub Pages** / deploy estático:

- Pasta: [`public-html/`](./public-html/)
- Workflow: [`.github/workflows/pages.yml`](./.github/workflows/pages.yml)

```bash
cd public-html && python3 -m http.server 8080
```

Após merge em `main` e Pages habilitado: `https://plentyengenharia.github.io/comprasja/`
