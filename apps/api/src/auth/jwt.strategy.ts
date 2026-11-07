import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from './auth.types';

type JwtPayload = {
  sub: string;
  email: string;
  orgId?: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: { organization: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Sessão inválida');
    }

    const memberships = user.memberships.map((m) => ({
      organizationId: m.organizationId,
      organizationName: m.organization.tradeName ?? m.organization.legalName,
      organizationType: m.organization.type as RequestUser['memberships'][number]['organizationType'],
      role: m.role as RequestUser['memberships'][number]['role'],
    }));

    const active = payload.orgId
      ? memberships.find((m) => m.organizationId === payload.orgId)
      : memberships[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerifiedAt: user.emailVerifiedAt,
      mfaEnabled: user.mfaEnabled,
      memberships,
      activeOrganizationId: active?.organizationId,
      activeRole: active?.role,
    };
  }
}
