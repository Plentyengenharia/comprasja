import type { MembershipRole, OrganizationType } from '@compras-ja/shared';

export type RequestMembership = {
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  role: MembershipRole;
};

export type RequestUser = {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: Date | null;
  mfaEnabled: boolean;
  memberships: RequestMembership[];
  activeOrganizationId?: string;
  activeRole?: MembershipRole;
};
