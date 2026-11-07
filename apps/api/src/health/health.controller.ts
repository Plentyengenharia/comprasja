import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BRAND } from '@compras-ja/shared';
import { Public } from '../common/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    let database: 'up' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      database = 'down';
    }

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      service: BRAND.slug,
      brand: BRAND.name,
      database,
      officialBiddingEnabled: process.env.FEATURE_OFFICIAL_BIDDING === 'true',
      pncpPublishEnabled: process.env.PNCP_PUBLISH_ENABLED === 'true',
      timestamp: new Date().toISOString(),
    };
  }
}
