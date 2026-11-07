import { MembershipRole, OrganizationType } from './enums';

/** Permissões atômicas — checadas no backend, nunca só na UI. */
export const PERMISSIONS = [
  'org:read',
  'org:manage',
  'org:members:manage',
  'procurement:read',
  'procurement:write',
  'procurement:approve',
  'procurement:publish',
  'proposal:read',
  'proposal:write',
  'proposal:submit',
  'bid:read',
  'bid:place',
  'session:moderate',
  'judgment:write',
  'qualification:write',
  'appeal:write',
  'contract:read',
  'contract:write',
  'contract:inspect',
  'billing:read',
  'billing:manage',
  'admin:tenants',
  'admin:support',
  'admin:audit',
  'audit:read',
  /** Propostas sigilosas — NÃO concedida a GLOBAL_ADMIN por padrão */
  'proposal:secret:read',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const SUPPLIER_BASE: Permission[] = [
  'org:read',
  'procurement:read',
  'proposal:read',
  'bid:read',
  'contract:read',
];

const PUBLIC_BASE: Permission[] = [
  'org:read',
  'procurement:read',
  'proposal:read',
  'bid:read',
  'contract:read',
  'audit:read',
];

export const ROLE_PERMISSIONS: Record<MembershipRole, Permission[]> = {
  ORG_ADMIN: [
    ...PUBLIC_BASE,
    'org:manage',
    'org:members:manage',
    'procurement:write',
    'procurement:approve',
    'procurement:publish',
    'session:moderate',
    'judgment:write',
    'qualification:write',
    'appeal:write',
    'contract:write',
  ],
  CONTRACTING_AGENT: [
    ...PUBLIC_BASE,
    'procurement:write',
    'procurement:approve',
    'session:moderate',
    'judgment:write',
    'qualification:write',
    'appeal:write',
  ],
  AUCTIONEER: [
    ...PUBLIC_BASE,
    'session:moderate',
    'judgment:write',
    'qualification:write',
    'appeal:write',
  ],
  CONTRACTING_COMMISSION: [...PUBLIC_BASE, 'judgment:write', 'qualification:write', 'appeal:write'],
  SUPPORT_TEAM: [...PUBLIC_BASE, 'procurement:write'],
  COMPETENT_AUTHORITY: [...PUBLIC_BASE, 'procurement:approve', 'procurement:publish', 'contract:write'],
  CONTRACT_MANAGER: [...PUBLIC_BASE, 'contract:write'],
  CONTRACT_INSPECTOR: [...PUBLIC_BASE, 'contract:inspect'],
  SUPPLIER_ADMIN: [
    ...SUPPLIER_BASE,
    'org:manage',
    'org:members:manage',
    'proposal:write',
    'proposal:submit',
    'bid:place',
    'contract:read',
  ],
  AUTHORIZED_REPRESENTATIVE: [
    ...SUPPLIER_BASE,
    'proposal:write',
    'proposal:submit',
    'bid:place',
  ],
  PROPOSAL_OWNER: [...SUPPLIER_BASE, 'proposal:write', 'proposal:submit', 'bid:place'],
  ANALYST: [...SUPPLIER_BASE, 'proposal:write'],
  READ_ONLY: [...SUPPLIER_BASE],
  GLOBAL_ADMIN: [
    'org:read',
    'org:manage',
    'org:members:manage',
    'admin:tenants',
    'admin:support',
    'billing:read',
    'billing:manage',
    'audit:read',
    // Sem proposal:secret:read — admin técnico não vê propostas sigilosas
  ],
  FINANCE: ['billing:read', 'billing:manage', 'admin:tenants', 'audit:read'],
  SUPPORT: ['admin:support', 'org:read', 'audit:read'],
  AUDITOR: ['admin:audit', 'audit:read', 'org:read'],
};

export function permissionsForRole(role: MembershipRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: MembershipRole, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}

export function defaultRoleForOrgType(type: OrganizationType): MembershipRole {
  switch (type) {
    case OrganizationType.PUBLIC_BODY:
      return MembershipRole.ORG_ADMIN;
    case OrganizationType.SUPPLIER:
      return MembershipRole.SUPPLIER_ADMIN;
    case OrganizationType.PLATFORM:
      return MembershipRole.GLOBAL_ADMIN;
  }
}
