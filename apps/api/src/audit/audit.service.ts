import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

type AuditInput = {
  actorId?: string | null;
  organizationId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditInput) {
    const payload = {
      actorId: input.actorId ?? null,
      organizationId: input.organizationId ?? null,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      metadata: input.metadata ?? undefined,
      createdAt: new Date().toISOString(),
    };
    const integrityHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');

    return this.prisma.auditEvent.create({
      data: {
        actorId: input.actorId ?? undefined,
        organizationId: input.organizationId ?? undefined,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? undefined,
        ipAddress: input.ipAddress ?? undefined,
        userAgent: input.userAgent ?? undefined,
        metadata: (input.metadata as object | undefined) ?? undefined,
        integrityHash,
      },
    });
  }
}
