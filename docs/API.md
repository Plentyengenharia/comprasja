# API — Compras Já

Base: `/api/v1`  
OpenAPI: `/api/docs`

## Rotas do Marco 1

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/health` | público | Saúde + flags oficiais |
| POST | `/auth/register` | público | Cadastro de usuário |
| POST | `/auth/login` | público | Login + tokens |
| POST | `/auth/refresh` | público | Renovar access |
| GET | `/auth/me` | JWT | Perfil e memberships |
| POST | `/auth/logout` | JWT | Revoga sessão |
| POST | `/auth/organizations` | JWT | Cria órgão/fornecedor |
| GET | `/organizations/mine` | JWT | Organizações do usuário |
| GET | `/procurements/public` | público | Transparência |
| GET | `/procurements/public/:id` | público | Detalhe público |
| GET | `/procurements/org/:orgId` | JWT + `procurement:read` | Processos do órgão |
| GET | `/admin/overview` | JWT + `admin:tenants` | Indicadores SaaS |

Rotas futuras (`/bids`, `/proposals`, `/contracts`, `/integrations/pncp`, etc.) seguirão o mesmo versionamento.
