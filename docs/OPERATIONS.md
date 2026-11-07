# Operações — Compras Já

## Health

`GET /api/v1/health` — status da API e conectividade PostgreSQL.

## Logs

Logs estruturados NestJS (nível via `LOG_LEVEL`). OpenTelemetry opcional (`OTEL_ENABLED`).

## Jobs

Worker BullMQ: outbox, sync PNCP consulta, e-mail, alertas. Sem Redis → dry-run.

## Incidentes

1. Verificar health e Redis
2. Revisar `audit_events` e `integration_sync_jobs`
3. Feature flags para desligar capacidades degradadas
4. Rollback de imagem + `prisma migrate` conforme runbook (a detalhar no Marco 10)
