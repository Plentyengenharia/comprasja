# Compras Já — Plano de Implementação

**Identificador técnico:** `compras-ja`  
**Nome de apresentação:** Compras Já | Plataforma de Licitações Eletrônicas  
**Slogan provisório:** Licitações inteligentes. Oportunidades reais.  
**Mercado:** Brasil · BRL · pt-BR · Lei 14.133/2021  
**Última atualização:** 2026-11-07 01:35 UTC (22:35 America/Sao_Paulo)

## Estado do repositório (inspeção inicial)

| Item | Situação |
|------|----------|
| Código de aplicação | Estava ausente (somente `README.md`) |
| Marcas anteriores | Nenhuma referência a Procura Cloud |
| Domínio | Configurável via env — nenhuma URL de produção afirmada |
| Credenciais / PNCP / pagamentos | Não inventadas; oficiais desativados |

## Arquitetura

Monorepo `pnpm` + Turborepo: `apps/web`, `apps/api`, `apps/worker`, `packages/{ui,database,shared,config}`, `infra`, `docs`, `tests`.

## Marcos

| Marco | Escopo | Status |
|-------|--------|--------|
| 1 | Monorepo, banco, autenticação, permissões, design system | **CONCLUÍDO (base)** |
| 2 | Site institucional completo | **PARCIAL** |
| 3 | Portais fornecedor/órgão + cadastros | **PARCIAL** (shells) |
| 4–10 | Processos → deploy oficial | NÃO INICIADO / BLOQUEADO onde couber |

---

## Registro do Marco 1

### Status: CONCLUÍDO (base executável)

### Arquivos principais criados

- Workspace: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.env.example`, CI
- `packages/shared` — marca, enums, CNPJ alfanumérico, RBAC, Zod
- `packages/database` — Prisma schema completo + migration `init` + seed demo
- `packages/ui` — logo, botões, cards, inputs, tokens, dark CSS vars
- `apps/api` — NestJS `/api/v1` auth, orgs, procurements públicos, admin, health, OpenAPI
- `apps/web` — institucional, login/cadastro, transparência, shells dos portais
- `apps/worker` — BullMQ dry-run / Redis
- `infra/docker-compose.yml` + Dockerfiles
- Documentação em `docs/` + `IMPLEMENTATION_PLAN.md`

### Funcionalidades concluídas

- Auth: register, login, refresh, logout, me, create organization
- RBAC com `PermissionsGuard`; admin **sem** `proposal:secret:read`
- Health check real (PostgreSQL)
- Listagem pública de licitações a partir do banco
- Design system e marca **Compras Já**
- Feature flags / PNCP publish desativados no seed

### Testes executados (reais)

| Suíte | Resultado |
|-------|-----------|
| Vitest `@compras-ja/shared` (CNPJ) | 3 passed |
| Vitest `@compras-ja/api` (RBAC) | 3 passed |
| Vitest `@compras-ja/worker` | 1 passed |
| `pnpm --filter @compras-ja/api build` | ok |
| `NODE_ENV=production` web build | ok (22 rotas) |
| `GET /api/v1/health` | `status: ok`, `database: up` |
| `POST /api/v1/auth/login` (demo) | tokens emitidos |
| `GET /api/v1/procurements/public` | processo demo 001/2026 |

### Erros corrigidos

- Extensões ESM / `moduleResolution` no `shared` e `ui`
- Tipos Prisma JSON e status readonly
- Build Next.js com `NODE_ENV=production`
- Shadow DB Prisma (`CREATEDB` no role local)

### Pendências / bloqueios

- MFA TOTP completo, e-mail SMTP, recuperação de senha
- Dashboards ainda sem binding completo aos endpoints autenticados
- Motor de disputas, propostas, contratos: NÃO INICIADO
- PNCP publicação / certames oficiais: **BLOQUEADO**
- Domínio de produção: **BLOQUEADO** (proprietário)
- Docker não disponível neste ambiente de agente — PostgreSQL/Redis locais usados para validação

### Próxima etapa técnica

Aprofundar Marco 2 (FAQ/SEO polidos, páginas institucionais) e Marco 3 (cadastro org na UI + dashboards com dados autenticados da API).
