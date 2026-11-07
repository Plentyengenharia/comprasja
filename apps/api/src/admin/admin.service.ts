import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(): Promise<{
    indicators: Record<string, number | string>;
    featureFlags: Array<{ key: string; enabled: boolean; description: string | null }>;
    notes: string[];
  }> {
    const [
      publicBodies,
      suppliers,
      users,
      subscriptions,
      procurements,
      sessions,
      flags,
    ] = await Promise.all([
      this.prisma.organization.count({ where: { type: 'PUBLIC_BODY' } }),
      this.prisma.organization.count({ where: { type: 'SUPPLIER' } }),
      this.prisma.user.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.procurementProcess.count(),
      this.prisma.biddingSession.count(),
      this.prisma.featureFlag.findMany({ orderBy: { key: 'asc' } }),
    ]);

    return {
      indicators: {
        publicBodies,
        suppliers,
        users,
        activeSubscriptions: subscriptions,
        procurements,
        biddingSessions: sessions,
        // Receita não inventada — zero até provedor de pagamento configurado
        mrrBrl: '0.0000',
        arrBrl: '0.0000',
      },
      featureFlags: flags.map((f) => ({
        key: f.key,
        enabled: f.enabled,
        description: f.description,
      })),
      notes: [
        'Indicadores financeiros permanecerão zerados até integração de pagamento homologada.',
        'Publicação PNCP e certames oficiais estão desativados por feature flag.',
      ],
    };
  }
}
