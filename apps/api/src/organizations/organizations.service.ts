import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../auth/auth.types';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(user: RequestUser) {
    return this.prisma.organizationMember.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      include: {
        organization: {
          select: {
            id: true,
            type: true,
            legalName: true,
            tradeName: true,
            taxId: true,
            city: true,
            state: true,
            isActive: true,
          },
        },
      },
    });
  }

  async getOne(user: RequestUser, id: string) {
    const membership = user.memberships.find((m) => m.organizationId === id);
    if (!membership) {
      throw new ForbiddenException('Acesso negado a esta organização');
    }

    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) throw new NotFoundException('Organização não encontrada');
    return org;
  }
}
