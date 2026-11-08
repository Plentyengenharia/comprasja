# Technical Baseline — Compras Já

**Data da auditoria:** 2026-11-08
**Commit auditado:** `ecebc25` — `feat(public-html): hub LICIA em trilhas ortogonais estilo microchip (#13)`
**Branch:** `main` (única branch remota; working tree limpo)
**Método:** inspeção estática do monorepo clonado (`--depth 1`), contagem de rotas e endpoints, verificação de consumo real de API, conferência de tokens de design, leitura de CI e configuração de deploy.
**Escopo não coberto:** execução de build, migrations, testes ou requisições HTTP. Este ambiente não tem acesso ao banco nem ao host de produção. Nenhuma afirmação abaixo depende de execução; onde a verificação exigiria execução, isto está dito explicitamente.

Este documento atende a §3.2 da *Master Engineering Specification* e substitui, para fins de linha de base, as afirmações de `IMPLEMENTATION_PLAN.md` e `docs/MODULE_MATRIX.md` — ambos revisados e, nos pontos materiais, confirmados.

---

## 1. Resumo executivo

O repositório é uma **fundação bem construída com o domínio de negócio ainda não implementado**. A distância entre o modelo de dados e o código executável é o fato central desta auditoria:

| Medida | Valor |
|--------|-------|
| Modelos Prisma declarados | 52 |
| Modelos Prisma com qualquer código que os acesse | **9** |
| Modelos Prisma sem nenhum acesso em código | **43** |
| Endpoints HTTP na API | 13 |
| Endpoints de escrita (POST/PATCH/PUT/DELETE) | 5 — **todos de autenticação** |
| Endpoints de escrita no domínio de licitações | **0** |
| Rotas Next.js existentes | 18 |
| Rotas da área autenticada | 3 (uma por perfil, sem sub-rotas) |
| Chamadas à API nas páginas autenticadas | **0** |
| Arquivos de teste | 7 (4 unitários, 1 config, 1 markdown, 1 spec Playwright) |

A infraestrutura (monorepo, Prisma, NestJS, RBAC, CI, identidade visual, site institucional) está em condição real de uso. O ciclo de contratação — criar processo, fase preparatória, aprovações, publicação, propostas, disputa, julgamento, habilitação, recursos, adjudicação, homologação, contratos — **não existe como código executável em nenhum ponto**. O schema o antecipa por completo; a API não o expõe; a interface não o consome.

Isto não é uma crítica ao trabalho anterior, que foi honesto a respeito do próprio estado (`RELEASE_READINESS.md` conclui corretamente que o produto não está pronto para operação oficial). É o ponto de partida real.

---

## 2. Stack verificada

| Camada | Tecnologia | Versão declarada | Observação |
|--------|-----------|------------------|------------|
| Monorepo | pnpm workspaces + Turborepo | — | `apps/{web,api,worker}`, `packages/{shared,ui,database,config}` |
| Frontend | Next.js | ^15.2.4 | App Router, React 19.1 |
| Estilo | Tailwind CSS | ^4.1.3 | via preset próprio em `packages/config/tailwind` |
| Componentes | `@compras-ja/ui` próprio | workspace | **shadcn/ui não está instalado** |
| Dados no cliente | TanStack Query ^5.72 / Table ^8.21 | instalado | **nunca importado** no código |
| Formulários | React Hook Form ^7.55 + Zod ^3.24 | instalado | usado apenas em login/cadastro |
| Backend | NestJS | ^11.0.12 | REST versionado `/api/v1`, OpenAPI via `@nestjs/swagger` |
| Segurança HTTP | helmet, @nestjs/throttler, cookie-parser | instalado | verificar ativação em `main.ts` ao executar |
| Autenticação | passport-jwt + bcryptjs | instalado | access/refresh com hash de refresh em `sessions` |
| ORM | Prisma | — | 52 modelos, 11 enums, 1 migration (`20261107013326_init`, 1137 linhas) |
| Banco | PostgreSQL 16 | CI usa `postgres:16-alpine` | `Decimal(18,4)` em todos os valores monetários — conforme §4.3 |
| Worker | BullMQ / Redis | — | dry-run / heartbeat |
| Infra | Docker Compose + Dockerfiles api/web | presente | não validado neste ambiente |

**Conformidade com §4.1 e §4.3:** a arquitetura existente é tecnicamente adequada e deve ser preservada conforme §4. Duas divergências em relação à especificação são intencionais e recomendo mantê-las: `packages/ui` próprio em lugar de shadcn/ui (§4.1 manda reutilizar dependências já presentes — introduzir shadcn agora criaria dois sistemas de componentes), e ausência de `tests/` na raiz (os testes vivem junto aos pacotes, o que é preferível).

**Conformidade §4.3 confirmada:** valores monetários usam `Decimal(18,4)`; não há `Float` em campo financeiro. Timestamps são `DateTime` do Prisma (UTC no Postgres), com `timezone` default `America/Sao_Paulo` no `User` para exibição.

---

## 3. Classificação funcional (§3.2)

Categorias conforme a especificação: **Implementada e validada** · **Implementada parcialmente** · **Apenas frontend** · **Apenas backend** · **Simulada** · **Ausente** · **Bloqueada por dependência externa**.

Nenhum item recebeu "Implementada e validada", porque validação exige execução de testes e requisições, o que esta auditoria não pôde fazer. Itens com evidência estática forte e testes automatizados existentes estão marcados como *parcialmente*, com a ressalva registrada.

### 3.1 Plataforma e infraestrutura

| Funcionalidade | Classificação | Evidência |
|---|---|---|
| Monorepo pnpm/Turbo | Implementada parcialmente | `pnpm-workspace.yaml`, `turbo.json`; build não executado aqui |
| Schema e migration | Implementada parcialmente | 52 modelos, migration `init` íntegra; `migrate deploy` roda no CI |
| CI (build + testes) | Implementada parcialmente | `ci.yml` sobe Postgres, roda `migrate deploy`, testes de `shared` e `api`, builds dos 5 pacotes |
| Health check | Apenas backend | `GET /api/v1/health` com checagem de Postgres; nenhuma UI consome |
| Logging estruturado (§4.2) | Ausente | nenhum logger configurado além do default do Nest |
| Docker / compose | Implementada parcialmente | arquivos presentes, não validados |
| Deploy da API e do web | **Ausente** | ver R5 |
| Monitoramento, backups (§4.4) | Ausente | nenhuma configuração no repositório |

### 3.2 Identidade, autorização e multitenancy

| Funcionalidade | Classificação | Evidência |
|---|---|---|
| Register / login / refresh / logout / me | Implementada parcialmente | `auth.controller.ts` (5 rotas); teste de RBAC existe |
| Criação de organização | Apenas backend | `POST /api/v1/auth/organizations`; UI não oferece o fluxo |
| Listar organizações do usuário | Apenas backend | `GET /organizations/mine`, `GET /organizations/:id` |
| Matriz RBAC | Implementada parcialmente | `packages/shared` + `PermissionsGuard`; `permissions.test.ts` cobre 3 casos |
| Isolamento entre tenants | **Implementada parcialmente — com falha** | ver R1. `listForOrg` valida vínculo corretamente; o guard de permissão não está acoplado ao órgão do recurso |
| Unidades organizacionais (§6.1) | Ausente | modelo `OrganizationUnit` existe; nenhum código o acessa |
| Convites de usuário | Ausente | modelo `Invitation` existe; sem endpoints |
| Troca de órgão ativo (`OrganizationSwitcher`, §5.3) | Ausente | `orgId` vem do JWT; não há endpoint para trocá-lo nem componente |
| MFA / TOTP | Ausente | campos `mfaEnabled`/`mfaSecret` no schema; sem endpoints |
| Recuperação de senha / e-mail | Bloqueada por dependência externa | exige provedor SMTP não configurado |
| Trilha de auditoria | Implementada parcialmente | `AuditService.record` funciona, mas é chamado **somente em `auth.service.ts`** (3 pontos); hash não encadeado — ver R7 |

### 3.3 Portal do Órgão (§5.2, §7, §8) — módulo prioritário

| Funcionalidade | Classificação | Evidência |
|---|---|---|
| `AppShell` / header / sidebar | Apenas frontend | `components/app/app-shell.tsx`; renderiza, não consome dados |
| Dashboard com indicadores (§7.1) | **Simulada** | `app/orgao/page.tsx`, 59 linhas, indicadores fixos `'—'` e `'0'`; nenhum cálculo no backend; cards não navegam |
| Navegação do portal | **Simulada — links quebrados** | 7 dos 8 itens do sidebar apontam para rotas inexistentes — ver R3 |
| Criar processo (§7.2) | **Ausente** | nenhum `POST /procurements` |
| Listar processos do órgão | Apenas backend | `GET /procurements/org/:organizationId` existe; nenhuma UI o chama |
| Pesquisar / filtrar / ordenar / paginar (§7.2) | Ausente | paginação existe apenas no endpoint público |
| Editar processo, arquivar | Ausente | sem endpoints de escrita |
| Máquina de estados (§7.3) | **Ausente** | enum com 16 estados e modelo `ProcurementApproval` existem; **nenhum código de transição** |
| Fase preparatória (§8) | **Ausente** | rota `/orgao/processos/[id]/preparatoria` não existe; DFD, ETP, TR, riscos, pesquisa de preços: nenhum código |
| Aprovações / devoluções (§8.1) | Ausente | modelo existe; sem serviço |
| Upload e versionamento de documentos | Ausente | `FileObject`/`FileVersion` no schema; sem storage configurado |
| Editais, sessões, julgamento, habilitação, recursos, homologação | Ausente | schema completo; zero código |
| Atas e contratos | Ausente | 5 modelos de contrato; zero código |
| Relatórios | Ausente | — |
| Prazos / notificações | Ausente | `ProcurementDeadline`, `Notification`, `NotificationPreference`; zero código |

### 3.4 Demais domínios

| Funcionalidade | Classificação | Evidência |
|---|---|---|
| Site institucional (`public-html`) | Implementada parcialmente | 13 HTML + CSS/JS; é o **único artefato em produção** |
| Páginas institucionais Next.js | Implementada parcialmente | 11 rotas em `(marketing)` — duplicam o `public-html` (ver R10) |
| Transparência pública | Implementada parcialmente | `GET /procurements/public` + `/transparencia` e `/transparencia/[id]`; único caminho ponta a ponta real |
| Portal do Fornecedor | Simulada | `app/fornecedor/page.tsx`, shell estático |
| Portal Administrativo | Simulada | `app/admin/page.tsx` com placeholders; `GET /admin/overview` existe e não é consumido |
| Propostas, disputa, lances | Ausente | 11 modelos (incl. `Bid` com `idempotencyKey` e `sequence`); zero código |
| Pagamentos / assinaturas | Bloqueada por dependência externa | `Plan`/`Subscription`/`Invoice`/`Payment`; sem provedor |
| Integração PNCP | Bloqueada por dependência externa | `docs/PNCP_INTEGRATION.md`; feature flags desligadas no seed |
| **LICIA** | **Ausente** | **zero ocorrências de "LICIA" em `apps/` e `packages/`**; existe apenas como peça de marketing no `public-html` |
| Worker / filas | Simulada | `smoke.test.ts` e heartbeat; nenhum job de negócio |
| Formulário de contato | Simulada | `mailto:` no `public-html`, sem backend |

---

## 4. Riscos de implementação

Ordenados por severidade. Cada risco traz o que precisa ser feito antes de construir sobre ele.

### R1 — Escalonamento de privilégio entre órgãos · **ALTO · segurança**

`PermissionsGuard` autoriza com base em `user.activeRole`, que o `JwtStrategy` deriva do `orgId` **contido no token**. O `ProcurementsController.listOrg` recebe o órgão alvo como **parâmetro de rota** e o `ProcurementsService.listForOrg` valida o vínculo contra esse parâmetro. São dois órgãos diferentes na mesma requisição.

Consequência: um usuário com papel forte no órgão A e papel fraco no órgão B emite o token com `orgId = A`, chama `GET /procurements/org/B`, passa o guard com a permissão de A e recebe os dados de B. O vínculo com B existe, então a checagem de tenant também passa.

Hoje o impacto é limitado — o único endpoint afetado é de leitura. Mas este é exatamente o padrão que §6.2 proíbe ("não utilizar apenas o nome do papel como critério universal de autorização") e §6.3 item 5 exige corrigir, e qualquer endpoint de escrita construído sobre o guard atual herda a falha. **Corrigir antes de escrever o primeiro endpoint de escrita do domínio.**

Correção recomendada: o guard deve resolver o órgão **a partir do recurso ou do parâmetro da requisição**, não do token, e então buscar o papel do usuário naquele órgão específico. O `orgId` do token passa a ser preferência de contexto para a UI, nunca prova de autorização — como §6.3 determina.

### R2 — O domínio de negócio não existe · **ALTO · escopo**

43 dos 52 modelos não têm nenhum código que os acesse. Nenhum endpoint de escrita de licitação. Nenhuma transição de estado. A fase preparatória, que §8 define como primeiro domínio a implementar integralmente, está em zero.

Implicação de planejamento: o schema **não** é progresso de implementação. Ele é uma hipótese de modelagem ainda não exercitada por código. É provável que precise de ajustes ao encontrar os primeiros casos de uso reais — especialmente `ProcurementApproval` (que registra transições sem versionar o processo, exigido por §7.3) e `ProcurementDocument` (que não tem campos de autoria, versão ou estado de aprovação, exigidos por §8.1).

### R3 — Navegação do portal aponta para rotas inexistentes · **ALTO · §5.3**

O sidebar de `app/orgao/page.tsx` declara 8 itens. Apenas `/app/orgao` existe. Os outros 7 — `planejamento`, `processos`, `editais`, `propostas`, `sessoes`, `julgamentos`, `configuracoes` — levam a 404.

§5.3 é explícita: "nenhum componente deverá ter ações que apenas aparentem funcionar". Mesma situação nos portais de fornecedor e administrativo. Enquanto as rotas não existirem, os itens devem estar visivelmente desabilitados, não clicáveis.

### R4 — Os portais não consomem a API · **ALTO · §7.1**

Zero chamadas HTTP nas três páginas autenticadas. Os indicadores do dashboard são literais `'—'` e `'0'` no código-fonte. §7.1 exige que cada indicador seja calculado no backend e que os cards naveguem para a listagem filtrada correspondente.

Observação de direção técnica: TanStack Query e TanStack Table estão instalados e nunca importados. §4.1 manda reutilizá-los. Não há provider de Query configurado nem camada de cliente autenticado — `lib/api.ts` tem 19 linhas e não anexa token. **Esta é a primeira peça de infraestrutura a construir** antes de qualquer tela de dados.

### R5 — Não há alvo de hospedagem para a aplicação · **ALTO · §4.4**

`.hostinger/site.json` declara `"type": "static"`, `"source": "public-html"`. O workflow `deploy-hostinger.yml` empacota `public-html` e, no estágio de publicação, apenas registra um aviso: o deploy real depende de `HOSTINGER_API_TOKEN` e de ação manual via MCP.

Ou seja: **o que está em produção é exclusivamente o site institucional estático.** Não existe ambiente de homologação nem de produção para o Next.js ou o NestJS, e §4.4 já advertia que a hospedagem estática não executa esses serviços. Decidir o alvo (VPS, container, PaaS) e o Postgres gerenciado é pré-requisito para qualquer entrega verificável fora da máquina local — e é uma decisão de infraestrutura e custo que cabe ao proprietário, não a mim.

### R6 — Trilha de auditoria incompleta e não encadeada · **MÉDIO · §6.3, §8.1**

Dois problemas distintos:

1. **Cobertura.** `AuditService.record` é chamado em 3 pontos, todos em `auth.service.ts`. §6.3 item 7 exige auditoria de toda ação relevante.
2. **Integridade.** `integrityHash` é um SHA-256 do próprio payload do evento. Isso detecta alteração de um registro isolado, mas não detecta **remoção nem reordenação** de eventos, porque não encadeia o hash do evento anterior. Para um sistema de licitações, onde a trilha é prova, isso é insuficiente.

Correção: encadear (`hash(payload + hash_anterior)`) e chamar o serviço dentro da mesma transação das operações de domínio, para que não exista mudança de estado sem evento.

### R7 — LICIA não tem nenhuma base técnica · **MÉDIO · escopo**

A IA proprietária é vendida no site institucional e não tem uma linha de código. Não há provedor de modelo escolhido, nem chave, nem abstração, nem orçamento de custo, nem tratamento de dados sensíveis — e documentos de licitação em fase preparatória são sigilosos até a publicação (`secrecyUntil` no schema).

Risco material: a LICIA é a diferenciação comercial do produto e, hoje, é também a parte com maior distância entre promessa pública e realidade. Antes de implementar, é preciso definir provedor, política de retenção de dados do fornecedor de modelo, e o que acontece com o sigilo do §8 quando um documento é enviado a uma API de terceiros.

### R8 — `lint` da API é um stub que sempre passa · **MÉDIO · qualidade**

Em `apps/api/package.json`: `"lint": "echo \"lint:api ok\""`. O comando imprime sucesso sem verificar nada. O CI não roda os testes de `web` nem de `worker`, não roda `typecheck`, e não há nenhum teste de integração, E2E ou de isolamento entre tenants — apesar de §6.3 exigir explicitamente "testar tentativas de acesso entre tenants".

Cobertura real: 4 testes unitários (CNPJ, 3 casos de RBAC, marca, brand). Para o grau de criticidade do produto, esta é a lacuna de processo mais séria depois de R1.

### R9 — Tokens de design divergentes do contrato §5.1 · **MÉDIO · §5.1**

Existem **duas paletas conflitantes** no repositório:

| Origem | Valores | Status |
|---|---|---|
| `packages/shared/src/brand.ts` | `#171C22`, `#C9A35D`, `#E8D4AC`, `#FAFAF8`, `#19785E` | **confere com §5.1** |
| `packages/config/tailwind` (preset) | `#102A43`, `#176B9A`, `#0D9488`, ink `#122033`, line `#D9E3EE`, success `#16A34A` | **não confere** |

O preset do Tailwind é o que efetivamente pinta a aplicação, porque todas as classes usadas nas páginas (`text-ink`, `bg-surface`, `brand-navy`) resolvem por ele. Portanto **a área autenticada não está renderizando a identidade aprovada** — está em azul/teal, não no grafite e dourado do §5.1.

Há também resíduo de renomeação em `brand.ts`, com aliases semanticamente incorretos mantidos por compatibilidade: `navy: '#171C22'`, `charcoal: '#171C22'`, `emerald: '#C9A35D'` — "emerald" aponta para o dourado. Isso vai confundir qualquer um que use o token pelo nome.

Correção: uma única fonte de verdade para os tokens, alinhada ao §5.1, com os aliases incorretos removidos em uma migração de nomes.

Contraste dos tokens do §5.1, calculado (WCAG 2.1):

| Combinação | Razão | AA texto pequeno (4.5:1) |
|---|---|---|
| `#171C22` sobre `#FAFAF8` | 16.40:1 | passa com folga |
| `#68727D` sobre `#FAFAF8` | 4.68:1 | passa por margem estreita |
| `#C9A35D` sobre `#FAFAF8` | 2.26:1 | **reprova** |
| `#C9A35D` sobre `#FFFFFF` | 2.36:1 | **reprova** |

Isso confirma tecnicamente a instrução do §5.1: o dourado serve a ícones, elementos de marca, destaques e estados de seleção — nunca a texto pequeno. O texto secundário `#68727D` passa, mas sem margem; convém não escurecer o fundo nem clarear esse token sem recalcular.

### R10 — Site institucional duplicado em duas implementações · **BAIXO · manutenção**

O conteúdo institucional existe duas vezes: 13 páginas em `public-html` (em produção) e 11 rotas em `apps/web/src/app/(marketing)` (não publicadas). Toda alteração de conteúdo precisa ser feita em dois lugares, ou as versões divergem silenciosamente.

§4.1 permite que o HTML institucional permaneça estático, o que é uma decisão defensável. Mas então as rotas `(marketing)` do Next.js são código morto e deveriam ser removidas — ou, se o plano é consolidar no Next.js, o `public-html` deveria ser aposentado quando houver alvo de deploy (R5). Hoje nenhuma das duas decisões foi tomada.

### R11 — Especificação recebida está truncada · **MÉDIO · processo**

O documento fornecido termina no meio da §8.1, nos bullets da LICIA. Faltam, no mínimo: o detalhamento dos documentos da fase preparatória (DFD, ETP, TR, gestão de riscos, pesquisa de preços), o fluxo de aprovações, a especificação da LICIA, a estratégia de testes e os critérios de aceite.

Como §8 é o módulo a implementar primeiro, essa lacuna é imediata. Posso derivar os requisitos da Lei 14.133/2021 e da IN SEGES 58/2022, mas isso significa decidir no seu lugar coisas que você possivelmente já especificou.

---

## 5. Estado do Git e proteção do código existente (§3.3)

| Verificação | Resultado |
|---|---|
| Working tree | Limpo — nenhuma modificação não commitada |
| Branches | Apenas `main` (local e remota) |
| Último commit | `ecebc25`, 2026-11-08 21:34 UTC |
| Histórico | Não avaliado — clone `--depth 1`. Para `blame`/`bisect`, aprofundar com `fetch --depth=1000` |
| Migrations | 1 migration `init`; **não remover nem recriar** (§3.3) |
| `.env.example` | Presente; nenhum segredo commitado no repositório |

**Nota sobre push:** esta sessão tem leitura do repositório, mas **push é recusado** — o GitHub App da Anthropic não está instalado para a organização `Plentyengenharia`. Um administrador da organização pode instalá-lo em `https://github.com/apps/claude/installations/select_target`. Até então, entrego os arquivos para você commitar.

---

## 6. Sequenciamento recomendado

Decorre de §1.4 (evolução incremental: ciclos completos e verificáveis, em vez de todos os módulos superficialmente) e das dependências entre os riscos acima.

**Ciclo 0 — destravar (não entrega funcionalidade de usuário, habilita todo o resto)**
1. Corrigir R1: acoplar permissão ao órgão do recurso; adicionar teste de acesso entre tenants (§6.3).
2. Construir a camada de cliente autenticado no web: provider do TanStack Query, `lib/api.ts` com token e refresh (R4).
3. Unificar tokens de design em uma fonte de verdade conforme §5.1 (R9).
4. Desabilitar visivelmente os itens de navegação sem rota (R3).
5. Trocar o `lint` stub por ESLint real; adicionar `typecheck` e os testes faltantes ao CI (R8).

**Ciclo 1 — fase preparatória ponta a ponta (§8, módulo prioritário)**
Um processo, criado de verdade, percorrendo `DRAFT → IN_PREPARATION → IN_REVIEW → APPROVED` com transições no backend, aprovações registradas, auditoria encadeada em cada mudança, e a rota `/orgao/processos/[id]/preparatoria` consumindo dados reais. Documentos sem IA ainda — upload, versionamento e aprovação primeiro.

**Ciclo 2 — dashboard e listagens reais (§7.1, §7.2)**
Indicadores calculados no backend, cards navegando para listagens filtradas, pesquisa e paginação. Só faz sentido depois do Ciclo 1, porque antes dele não há processos para contar.

**Ciclo 3 — LICIA sobre a fase preparatória (R7)**
Depois de definidos provedor e política de sigilo. Começar por análise documental de leitura, que não altera estado, antes de geração de minutas.

**Decisões que dependem de você, não de mim**
- Alvo de hospedagem para API e web, e Postgres gerenciado (R5).
- Provedor de modelo da LICIA e política de tratamento de documentos sigilosos (R7).
- Consolidar o institucional em `public-html` ou no Next.js (R10).
- Enviar a continuação da especificação, ou autorizar que eu derive §8.2+ da legislação (R11).

---

*Documento produzido conforme §3.2 da Master Engineering Specification. Nenhum item foi declarado concluído ou publicado sem verificação, conforme §1.5.*
