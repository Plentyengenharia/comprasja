# Banco de dados — Compras Já

PostgreSQL 16 + Prisma ORM.

## Princípios

- UUID como PK
- FKs e índices por tenant / status / datas
- Monetários em `DECIMAL(18,4)`
- Datas em UTC; apresentação no fuso da organização/usuário
- CNPJ alfanumérico (14 chars) em `organizations.taxId`
- Multitenancy por `organizationId` nas entidades operacionais

## Grupos de entidades

Identidade, licitações, disputas, resultados, contratos, financeiro SaaS e sistema (conforme `packages/database/prisma/schema.prisma`).

## Migrations

```bash
pnpm db:migrate          # development
pnpm db:migrate:deploy   # staging/production
pnpm db:seed             # demo only
```

## RLS

Row Level Security será avaliada como camada adicional após estabilizar o isolamento aplicativo (testes de IDOR no Marco 9).
