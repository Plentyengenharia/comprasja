# Integração PNCP — Compras Já

Dois adaptadores independentes:

## 1. Consulta pública

- Importação de metadados e deduplicação
- Jobs periódicos via worker
- Armazenamento da fonte e tratamento de falhas

## 2. Publicação oficial

- **Desativada por padrão** (`PNCP_PUBLISH_ENABLED=false`, feature flag `pncp_publish`)
- Exige credenciais e habilitações — não presumidas neste repositório
- Quando ativada: autenticação autorizada, envio, retificações, atas, contratos, conciliação

Documentação oficial deve ser consultada antes de qualquer implementação de envio.  
Estado atual: conexão seed `PNCP_PUBLISH` com status `DISABLED`.
