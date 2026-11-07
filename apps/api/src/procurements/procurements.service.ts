import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { paginateMeta } from '@compras-ja/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../auth/auth.types';

@Injectable()
export class ProcurementsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: { page?: number; pageSize?: number; q?: string; state?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const publicStatuses = [
      'PUBLISHED',
      'RECEIVING_PROPOSALS',
      'DISPUTE',
      'HOMOLOGATION',
    ] as Array<'PUBLISHED' | 'RECEIVING_PROPOSALS' | 'DISPUTE' | 'HOMOLOGATION'>;

    const where = {
      isPublicTransparency: true,
      status: { in: publicStatuses },
      ...(query.q
        ? {
            OR: [
              { objectTitle: { contains: query.q, mode: 'insensitive' as const } },
              { processNumber: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(query.state
        ? { organization: { state: query.state.toUpperCase() } }
        : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.procurementProcess.count({ where }),
      this.prisma.procurementProcess.findMany({
        where,
        include: {
          organization: {
            select: { legalName: true, tradeName: true, city: true, state: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { items, ...paginateMeta(total, page, pageSize) };
  }

  async getPublic(id: string) {
    const process = await this.prisma.procurementProcess.findFirst({
      where: { id, isPublicTransparency: true },
      include: {
        organization: {
          select: { legalName: true, tradeName: true, city: true, state: true },
        },
        lots: { include: { items: true } },
        documents: { where: { isPublic: true } },
      },
    });
    if (!process) throw new NotFoundException('Processo não encontrado ou não público');
    return process;
  }

  async listForOrg(user: RequestUser, organizationId: string) {
    const membership = user.memberships.find((m) => m.organizationId === organizationId);
    if (!membership) throw new ForbiddenException('Acesso negado');

    return this.prisma.procurementProcess.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
      include: {
        lots: true,
        _count: { select: { proposals: true } },
      },
    });
  }
}
