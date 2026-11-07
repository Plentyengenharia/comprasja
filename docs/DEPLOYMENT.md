# Deploy — Compras Já

## Ambientes

| Ambiente | Uso |
|----------|-----|
| development | Local / demo |
| staging | Homologação |
| production | Somente componentes aprovados |

## Domínios (configuráveis)

```
www.<dominio>   → institucional
app.<dominio>   → portais
api.<dominio>   → backend
```

Variáveis: `PUBLIC_WEB_URL`, `PUBLIC_APP_URL`, `PUBLIC_API_URL`.

## Compose local

```bash
docker compose -f infra/docker-compose.yml up -d
```

## Checklist antes de publicar

1. Secrets reais (nunca os de `.env.example`)
2. Migrations aplicadas
3. `FEATURE_OFFICIAL_BIDDING=false` até homologação
4. HTTPS e DNS documentados pelo proprietário
5. Health check `GET /api/v1/health` respondendo `ok`
6. Nunca declarar URL publicada sem teste real
