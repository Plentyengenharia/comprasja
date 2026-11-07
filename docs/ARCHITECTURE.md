# Arquitetura — Compras Já

## Visão

Monólito modular em monorepo, com isolamento do motor de disputas para evolução independente.

```
┌─────────────┐   REST/WS    ┌─────────────┐
│  apps/web   │─────────────▶│  apps/api   │
└─────────────┘              └──────┬──────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              PostgreSQL          Redis         S3-compat
                    ▲               ▲
                    └───────┬───────┘
                            ▼
                       apps/worker
```

## Ambientes de produto

1. Institucional — marketing e contratação
2. Fornecedores — oportunidades e propostas
3. Órgãos — processos e sessões
4. Admin SaaS — tenants, billing, flags
5. Transparência — consulta pública

## Decisões

| Decisão | Motivo |
|---------|--------|
| NestJS + Prisma | Tipagem, OpenAPI e migrations versionadas |
| JWT access + refresh em sessão | Revogação e dispositivos |
| RBAC por membership | Um usuário, várias organizações |
| Monetários `Decimal(18,4)` | Evitar float |
| Outbox + BullMQ | Eventos confiáveis |
| Feature flags | Bloquear oficiais/PNCP publish |

## Não objetivos (ainda)

- Certame oficial em produção
- Credenciamento PNCP de publicação
- Afirmação de certificações sem evidência
