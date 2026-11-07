import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import {
  defaultRoleForOrgType,
  isValidCnpjFormat,
  normalizeCnpj,
  OrganizationType,
} from '@compras-ja/shared';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateOrganizationDto, LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto, meta?: { ip?: string; ua?: string }) {
    if (!dto.acceptTerms) {
      throw new BadRequestException('É necessário aceitar os Termos de Uso');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const rounds = Number(this.config.get('BCRYPT_ROUNDS') ?? 12);
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.toLowerCase(),
        passwordHash,
      },
    });

    await this.audit.record({
      actorId: user.id,
      action: 'auth.register',
      resourceType: 'user',
      resourceId: user.id,
      ipAddress: meta?.ip,
      userAgent: meta?.ua,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      message: 'Conta criada. Verifique o e-mail quando o SMTP estiver configurado.',
    };
  }

  async login(dto: LoginDto, meta?: { ip?: string; ua?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: { organization: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const memberships = user.memberships.map((m) => ({
      organizationId: m.organizationId,
      organizationName: m.organization.tradeName ?? m.organization.legalName,
      organizationType: m.organization.type,
      role: m.role,
    }));

    const active =
      (dto.organizationId
        ? memberships.find((m) => m.organizationId === dto.organizationId)
        : memberships[0]) ?? null;

    const tokens = await this.issueTokens(user.id, user.email, active?.organizationId);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: this.hashToken(tokens.refreshToken),
        ipAddress: meta?.ip,
        userAgent: meta?.ua,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await this.audit.record({
      actorId: user.id,
      organizationId: active?.organizationId,
      action: 'auth.login',
      resourceType: 'session',
      ipAddress: meta?.ip,
      userAgent: meta?.ua,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
        mfaEnabled: user.mfaEnabled,
      },
      memberships,
      activeOrganizationId: active?.organizationId ?? null,
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string; orgId?: string }>(
        refreshToken,
        { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') },
      );

      const session = await this.prisma.session.findFirst({
        where: {
          userId: payload.sub,
          refreshTokenHash: this.hashToken(refreshToken),
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) {
        throw new UnauthorizedException('Refresh inválido');
      }

      const tokens = await this.issueTokens(payload.sub, payload.email, payload.orgId);

      await this.prisma.session.update({
        where: { id: session.id },
        data: { refreshTokenHash: this.hashToken(tokens.refreshToken) },
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Refresh inválido');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: { organization: true },
        },
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      mfaEnabled: user.mfaEnabled,
      memberships: user.memberships.map((m) => ({
        organizationId: m.organizationId,
        organizationName: m.organization.tradeName ?? m.organization.legalName,
        organizationType: m.organization.type,
        role: m.role,
      })),
    };
  }

  async createOrganization(userId: string, dto: CreateOrganizationDto) {
    if (dto.type === OrganizationType.PLATFORM) {
      throw new BadRequestException('Tipo de organização não permitido via autoatendimento');
    }

    const taxId = normalizeCnpj(dto.taxId);
    if (!isValidCnpjFormat(taxId)) {
      throw new BadRequestException('CNPJ inválido (formato alfanumérico de 14 caracteres)');
    }

    const exists = await this.prisma.organization.findUnique({
      where: { taxId_type: { taxId, type: dto.type } },
    });
    if (exists) {
      throw new ConflictException('Organização já cadastrada para este CNPJ e tipo');
    }

    const role = defaultRoleForOrgType(dto.type);

    const organization = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          type: dto.type,
          legalName: dto.legalName,
          tradeName: dto.tradeName,
          taxId,
          email: dto.email.toLowerCase(),
          phone: dto.phone,
          city: dto.city,
          state: dto.state?.toUpperCase(),
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId,
          role,
          status: 'ACTIVE',
        },
      });

      const freePlan = await tx.plan.findUnique({ where: { code: 'PUBLIC_FREE' } });
      if (freePlan) {
        const now = new Date();
        const end = new Date(now);
        end.setFullYear(end.getFullYear() + 1);
        await tx.subscription.create({
          data: {
            organizationId: org.id,
            planId: freePlan.id,
            status: 'ACTIVE',
            currentPeriodStart: now,
            currentPeriodEnd: end,
          },
        });
      }

      return org;
    });

    await this.audit.record({
      actorId: userId,
      organizationId: organization.id,
      action: 'organization.create',
      resourceType: 'organization',
      resourceId: organization.id,
      metadata: { type: dto.type, taxId },
    });

    return organization;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.session.updateMany({
        where: {
          userId,
          refreshTokenHash: this.hashToken(refreshToken),
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
    } else {
      await this.prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { ok: true };
  }

  private async issueTokens(userId: string, email: string, orgId?: string) {
    const payload = { sub: userId, email, orgId };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TTL', '15m'),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TTL', '7d'),
    });
    return { accessToken, refreshToken, expiresIn: 900 };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  /** Utilitário para testes — gera token opaco. */
  static randomToken() {
    return randomBytes(32).toString('hex');
  }
}
