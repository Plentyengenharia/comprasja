import { z } from 'zod';
import { MembershipRole, OrganizationType } from './enums';

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(255),
  password: z.string().min(10).max(128),
  acceptTerms: z.literal(true),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  organizationId: z.string().uuid().optional(),
});

export const createOrganizationSchema = z.object({
  type: z.nativeEnum(OrganizationType),
  legalName: z.string().min(2).max(255),
  tradeName: z.string().min(1).max(255).optional(),
  taxId: z.string().min(14).max(18),
  email: z.string().email(),
  phone: z.string().min(8).max(30).optional(),
  city: z.string().min(2).max(120).optional(),
  state: z.string().length(2).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  mfaEnabled: boolean;
};

export type AuthMembership = {
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  role: MembershipRole;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
