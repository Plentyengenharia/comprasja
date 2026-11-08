# Matriz de módulos — Compras Já

**Data:** 2026-11-08  
**Método:** inspeção estática do monorepo (`apps/web`, `apps/api`, `packages/database`, `apps/worker`).  
**Não** declara backend verificado em produção a partir dos arquivos estáticos.

| Módulo | Status | Evidência |
|--------|--------|-----------|
| Site institucional (`public-html`) | IMPLEMENTADO (estático) | HTML/CSS/JS vitrine |
| Auth register/login/refresh/me/logout | IMPLEMENTADO (API + web local) | `apps/api` auth · `apps/web` login/cadastro |
| Organizações CRUD básico | PARCIAL | API create/list; UI incompleta |
| Procurements públicos | IMPLEMENTADO (API + web) | `procurements` + páginas transparência |
| Procurements por org | PARCIAL | API existe; UI portal não consome |
| Admin overview | PARCIAL | API counts; UI com placeholders |
| Portais órgão/fornecedor | SIMULADO | shells estáticos em `apps/web` |
| MFA | AUSENTE / schema only | campo seed; sem endpoints |
| Propostas / disputas / julgamento | AUSENTE | schema Prisma; sem controllers |
| Contratos | AUSENTE | schema; sem API/UI |
| Pagamentos / checkout | AUSENTE | models Plan/Subscription; sem gateway |
| PNCP sync | AUSENTE / desabilitado | docs + flags off |
| Worker jobs | SIMULADO | dry-run / heartbeat |
| Contato (vitrine) | PARCIAL | mailto no `public-html` (sem backend) |

Legenda: **IMPLEMENTADO** · **PARCIAL** · **SIMULADO** · **AUSENTE**
