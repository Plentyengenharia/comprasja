-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('PUBLIC_BODY', 'SUPPLIER', 'PLATFORM');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('ORG_ADMIN', 'CONTRACTING_AGENT', 'AUCTIONEER', 'CONTRACTING_COMMISSION', 'SUPPORT_TEAM', 'COMPETENT_AUTHORITY', 'CONTRACT_MANAGER', 'CONTRACT_INSPECTOR', 'SUPPLIER_ADMIN', 'AUTHORIZED_REPRESENTATIVE', 'PROPOSAL_OWNER', 'ANALYST', 'READ_ONLY', 'GLOBAL_ADMIN', 'FINANCE', 'SUPPORT', 'AUDITOR');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ProcurementStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVAL', 'READY_TO_PUBLISH', 'PUBLISHED', 'RECEIVING_PROPOSALS', 'DISPUTE', 'JUDGMENT', 'QUALIFICATION', 'APPEALS', 'ADJUDICATION', 'HOMOLOGATION', 'REVOKED', 'ANNULLED', 'FAILED', 'DESERTED');

-- CreateEnum
CREATE TYPE "JudgmentCriterion" AS ENUM ('LOWEST_PRICE', 'HIGHEST_DISCOUNT', 'TECHNICAL_AND_PRICE', 'HIGHEST_BID', 'BEST_TECHNIQUE');

-- CreateEnum
CREATE TYPE "DisputeMode" AS ENUM ('OPEN', 'CLOSED', 'COMBINED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'VALIDATING', 'SUBMITTED', 'WITHDRAWN', 'CLASSIFIED', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "BidSessionStatus" AS ENUM ('SCHEDULED', 'OPEN', 'SUSPENDED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PlanCode" AS ENUM ('PUBLIC_FREE', 'START', 'PRO', 'BUSINESS', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "phone" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'pt-BR',
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "taxId" TEXT NOT NULL,
    "cnae" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "district" TEXT,
    "city" TEXT,
    "state" CHAR(2),
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'BR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_units" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "invitedById" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_devices" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "label" TEXT,
    "userAgent" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_documents" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "docType" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_processes" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "unitId" UUID,
    "processNumber" TEXT NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "objectTitle" TEXT NOT NULL,
    "objectDescription" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "judgmentCriterion" "JudgmentCriterion" NOT NULL DEFAULT 'LOWEST_PRICE',
    "legalRegime" TEXT NOT NULL DEFAULT 'Lei 14.133/2021',
    "disputeMode" "DisputeMode" NOT NULL DEFAULT 'OPEN',
    "status" "ProcurementStatus" NOT NULL DEFAULT 'DRAFT',
    "estimatedValue" DECIMAL(18,4) NOT NULL,
    "secrecyUntil" TIMESTAMP(3),
    "proposalDeadlineAt" TIMESTAMP(3),
    "sessionScheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "isPublicTransparency" BOOLEAN NOT NULL DEFAULT true,
    "officialPncpId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_lots" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "lotNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estimatedValue" DECIMAL(18,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_items" (
    "id" UUID NOT NULL,
    "lotId" UUID NOT NULL,
    "itemNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unitPrice" DECIMAL(18,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_documents" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "docType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procurement_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_approvals" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "fromStatus" "ProcurementStatus" NOT NULL,
    "toStatus" "ProcurementStatus" NOT NULL,
    "actorId" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procurement_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_publications" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "externalId" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payloadJson" JSONB,

    CONSTRAINT "procurement_publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_deadlines" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procurement_deadlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clarification_requests" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "askedById" UUID,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "answeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clarification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "filedById" UUID,
    "content" TEXT NOT NULL,
    "decision" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_favorites" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "protocolNumber" TEXT,
    "submittedAt" TIMESTAMP(3),
    "totalValue" DECIMAL(18,4),
    "isSecret" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_items" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "lotId" UUID NOT NULL,
    "itemId" UUID,
    "unitPrice" DECIMAL(18,4) NOT NULL,
    "totalPrice" DECIMAL(18,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposal_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_documents" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "docType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_submissions" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "protocol" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bidding_sessions" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "lotId" UUID NOT NULL,
    "status" "BidSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "disputeMode" "DisputeMode" NOT NULL DEFAULT 'OPEN',
    "scheduledStartAt" TIMESTAMP(3) NOT NULL,
    "openedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "serverClockSkewMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bidding_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bidding_rounds" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "bidding_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "roundId" UUID,
    "bidderUserId" UUID NOT NULL,
    "bidderOrgId" UUID NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "idempotencyKey" TEXT NOT NULL,
    "clientSentAt" TIMESTAMP(3),
    "serverReceivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "sequence" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bidding_events" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "sequence" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bidding_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bidding_suspensions" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resumedAt" TIMESTAMP(3),
    "actorId" UUID,

    CONSTRAINT "bidding_suspensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judgments" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "notes" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" UUID,

    CONSTRAINT "judgments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualification_reviews" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "orgId" UUID NOT NULL,
    "result" TEXT NOT NULL,
    "notes" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qualification_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appeals" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "filedByOrgId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "decision" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appeals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awards" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "winnerOrgId" UUID NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homologations" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "homologatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" UUID,
    "notes" TEXT,

    CONSTRAINT "homologations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_registration_records" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_registration_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" UUID NOT NULL,
    "processId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "supplierOrgId" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "totalValue" DECIMAL(18,4) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_items" (
    "id" UUID NOT NULL,
    "contractId" UUID NOT NULL,
    "itemId" UUID,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unitPrice" DECIMAL(18,4) NOT NULL,

    CONSTRAINT "contract_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_amendments" (
    "id" UUID NOT NULL,
    "contractId" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valueDelta" DECIMAL(18,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_amendments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_events" (
    "id" UUID NOT NULL,
    "contractId" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "code" "PlanCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthlyPrice" DECIMAL(18,4) NOT NULL,
    "yearlyPrice" DECIMAL(18,4),
    "featuresJson" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_customers" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "providerRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "billingCustomerId" UUID NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "status" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "provider" TEXT NOT NULL,
    "providerPaymentId" TEXT,
    "status" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "payload" JSONB,
    "readAt" TIMESTAMP(3),
    "dedupeKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "organizationId" UUID,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "integrityHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_connections" (
    "id" UUID NOT NULL,
    "organizationId" UUID,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DISABLED',
    "configJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_sync_jobs" (
    "id" UUID NOT NULL,
    "connectionId" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "statsJson" JSONB,

    CONSTRAINT "integration_sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksum" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "uploadedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_versions" (
    "id" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "responseJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "organizations_type_idx" ON "organizations"("type");

-- CreateIndex
CREATE INDEX "organizations_state_city_idx" ON "organizations"("state", "city");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_taxId_type_key" ON "organizations"("taxId", "type");

-- CreateIndex
CREATE INDEX "organization_units_organizationId_idx" ON "organization_units"("organizationId");

-- CreateIndex
CREATE INDEX "organization_members_userId_idx" ON "organization_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organizationId_userId_key" ON "organization_members"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_tokenHash_key" ON "invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "invitations_organizationId_email_idx" ON "invitations"("organizationId", "email");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "user_devices_userId_idx" ON "user_devices"("userId");

-- CreateIndex
CREATE INDEX "organization_documents_organizationId_idx" ON "organization_documents"("organizationId");

-- CreateIndex
CREATE INDEX "procurement_processes_status_idx" ON "procurement_processes"("status");

-- CreateIndex
CREATE INDEX "procurement_processes_organizationId_status_idx" ON "procurement_processes"("organizationId", "status");

-- CreateIndex
CREATE INDEX "procurement_processes_publishedAt_idx" ON "procurement_processes"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_processes_organizationId_processNumber_fiscalYe_key" ON "procurement_processes"("organizationId", "processNumber", "fiscalYear");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_lots_processId_lotNumber_key" ON "procurement_lots"("processId", "lotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_items_lotId_itemNumber_key" ON "procurement_items"("lotId", "itemNumber");

-- CreateIndex
CREATE INDEX "procurement_documents_processId_idx" ON "procurement_documents"("processId");

-- CreateIndex
CREATE INDEX "procurement_approvals_processId_idx" ON "procurement_approvals"("processId");

-- CreateIndex
CREATE INDEX "procurement_publications_processId_idx" ON "procurement_publications"("processId");

-- CreateIndex
CREATE INDEX "procurement_deadlines_processId_dueAt_idx" ON "procurement_deadlines"("processId", "dueAt");

-- CreateIndex
CREATE INDEX "clarification_requests_processId_idx" ON "clarification_requests"("processId");

-- CreateIndex
CREATE INDEX "challenges_processId_idx" ON "challenges"("processId");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_favorites_userId_processId_key" ON "opportunity_favorites"("userId", "processId");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_protocolNumber_key" ON "proposals"("protocolNumber");

-- CreateIndex
CREATE INDEX "proposals_organizationId_status_idx" ON "proposals"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_processId_organizationId_key" ON "proposals"("processId", "organizationId");

-- CreateIndex
CREATE INDEX "proposal_items_proposalId_idx" ON "proposal_items"("proposalId");

-- CreateIndex
CREATE INDEX "proposal_documents_proposalId_idx" ON "proposal_documents"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_submissions_protocol_key" ON "proposal_submissions"("protocol");

-- CreateIndex
CREATE INDEX "bidding_sessions_status_idx" ON "bidding_sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "bidding_sessions_processId_lotId_key" ON "bidding_sessions"("processId", "lotId");

-- CreateIndex
CREATE UNIQUE INDEX "bidding_rounds_sessionId_roundNumber_key" ON "bidding_rounds"("sessionId", "roundNumber");

-- CreateIndex
CREATE INDEX "bids_sessionId_sequence_idx" ON "bids"("sessionId", "sequence");

-- CreateIndex
CREATE INDEX "bids_bidderOrgId_idx" ON "bids"("bidderOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "bids_sessionId_idempotencyKey_key" ON "bids"("sessionId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "bidding_events_sessionId_sequence_idx" ON "bidding_events"("sessionId", "sequence");

-- CreateIndex
CREATE INDEX "bidding_suspensions_sessionId_idx" ON "bidding_suspensions"("sessionId");

-- CreateIndex
CREATE INDEX "judgments_processId_idx" ON "judgments"("processId");

-- CreateIndex
CREATE INDEX "qualification_reviews_processId_idx" ON "qualification_reviews"("processId");

-- CreateIndex
CREATE INDEX "appeals_processId_idx" ON "appeals"("processId");

-- CreateIndex
CREATE INDEX "awards_processId_idx" ON "awards"("processId");

-- CreateIndex
CREATE INDEX "homologations_processId_idx" ON "homologations"("processId");

-- CreateIndex
CREATE INDEX "price_registration_records_processId_idx" ON "price_registration_records"("processId");

-- CreateIndex
CREATE INDEX "contracts_supplierOrgId_idx" ON "contracts"("supplierOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_organizationId_number_key" ON "contracts"("organizationId", "number");

-- CreateIndex
CREATE INDEX "contract_items_contractId_idx" ON "contract_items"("contractId");

-- CreateIndex
CREATE INDEX "contract_amendments_contractId_idx" ON "contract_amendments"("contractId");

-- CreateIndex
CREATE INDEX "contract_events_contractId_idx" ON "contract_events"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "plans_code_key" ON "plans"("code");

-- CreateIndex
CREATE UNIQUE INDEX "billing_customers_organizationId_key" ON "billing_customers"("organizationId");

-- CreateIndex
CREATE INDEX "subscriptions_organizationId_status_idx" ON "subscriptions"("organizationId", "status");

-- CreateIndex
CREATE INDEX "invoices_billingCustomerId_idx" ON "invoices"("billingCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotencyKey_key" ON "payments"("idempotencyKey");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_idx" ON "notifications"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_userId_dedupeKey_key" ON "notifications"("userId", "dedupeKey");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_channel_eventType_key" ON "notification_preferences"("userId", "channel", "eventType");

-- CreateIndex
CREATE INDEX "audit_events_organizationId_createdAt_idx" ON "audit_events"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_events_resourceType_resourceId_idx" ON "audit_events"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "integration_connections_provider_status_idx" ON "integration_connections"("provider", "status");

-- CreateIndex
CREATE INDEX "integration_sync_jobs_connectionId_startedAt_idx" ON "integration_sync_jobs"("connectionId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "files_storageKey_key" ON "files"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "file_versions_fileId_version_key" ON "file_versions"("fileId", "version");

-- CreateIndex
CREATE INDEX "outbox_events_publishedAt_createdAt_idx" ON "outbox_events"("publishedAt", "createdAt");

-- CreateIndex
CREATE INDEX "idempotency_keys_expiresAt_idx" ON "idempotency_keys"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_scope_key_key" ON "idempotency_keys"("scope", "key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_units" ADD CONSTRAINT "organization_units_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_documents" ADD CONSTRAINT "organization_documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_documents" ADD CONSTRAINT "organization_documents_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_processes" ADD CONSTRAINT "procurement_processes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_processes" ADD CONSTRAINT "procurement_processes_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "organization_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_lots" ADD CONSTRAINT "procurement_lots_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_items" ADD CONSTRAINT "procurement_items_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "procurement_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_documents" ADD CONSTRAINT "procurement_documents_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_documents" ADD CONSTRAINT "procurement_documents_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_approvals" ADD CONSTRAINT "procurement_approvals_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_publications" ADD CONSTRAINT "procurement_publications_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_deadlines" ADD CONSTRAINT "procurement_deadlines_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification_requests" ADD CONSTRAINT "clarification_requests_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_favorites" ADD CONSTRAINT "opportunity_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_favorites" ADD CONSTRAINT "opportunity_favorites_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_items" ADD CONSTRAINT "proposal_items_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_items" ADD CONSTRAINT "proposal_items_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "procurement_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_items" ADD CONSTRAINT "proposal_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "procurement_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_documents" ADD CONSTRAINT "proposal_documents_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_documents" ADD CONSTRAINT "proposal_documents_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_submissions" ADD CONSTRAINT "proposal_submissions_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidding_sessions" ADD CONSTRAINT "bidding_sessions_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidding_sessions" ADD CONSTRAINT "bidding_sessions_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "procurement_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidding_rounds" ADD CONSTRAINT "bidding_rounds_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "bidding_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "bidding_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "bidding_rounds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_bidderUserId_fkey" FOREIGN KEY ("bidderUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidding_events" ADD CONSTRAINT "bidding_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "bidding_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidding_suspensions" ADD CONSTRAINT "bidding_suspensions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "bidding_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judgments" ADD CONSTRAINT "judgments_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awards" ADD CONSTRAINT "awards_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homologations" ADD CONSTRAINT "homologations_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_processId_fkey" FOREIGN KEY ("processId") REFERENCES "procurement_processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_items" ADD CONSTRAINT "contract_items_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_items" ADD CONSTRAINT "contract_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "procurement_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_amendments" ADD CONSTRAINT "contract_amendments_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_events" ADD CONSTRAINT "contract_events_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_customers" ADD CONSTRAINT "billing_customers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_billingCustomerId_fkey" FOREIGN KEY ("billingCustomerId") REFERENCES "billing_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_connections" ADD CONSTRAINT "integration_connections_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_sync_jobs" ADD CONSTRAINT "integration_sync_jobs_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "integration_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_versions" ADD CONSTRAINT "file_versions_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
