# Testes — Compras Já

## Atual (Marco 1)

| Suíte | Ferramenta | Escopo |
|-------|------------|--------|
| Unit | Vitest | CNPJ, RBAC |
| Smoke worker | Vitest | Marca |
| Manual | curl / browser | Health, login, transparência |

## Planejado

- Integração API (auth, tenant isolation)
- Playwright E2E (cadastro → proposta)
- k6 (lances concorrentes, idempotência)
- Recuperação de sessão / suspensão

Resultados reais devem ser registrados a cada marco — não marcar como concluído sem execução.
