# Segurança — Compras Já

## Controles iniciais (Marco 1)

- Helmet + CORS restrito às URLs configuradas
- Rate limiting (Throttler)
- Senhas com bcrypt (custo configurável)
- JWT access curto + refresh com hash em `sessions`
- RBAC no backend (`PermissionsGuard`)
- Admin técnico **sem** `proposal:secret:read`
- Validação de entrada (class-validator / Zod)
- Auditoria com `integrityHash` SHA-256 do payload

## Pendências

- MFA TOTP completo (flag habilitada; fluxo UI/API parcial)
- Verificação de e-mail com SMTP
- Proteções avançadas de upload e antivírus
- Testes de penetração / ASVS formal
- Backups automatizados e DR documentados com RPO/RTO medidos

Não afirmar certificações ou homologações sem comprovação.
