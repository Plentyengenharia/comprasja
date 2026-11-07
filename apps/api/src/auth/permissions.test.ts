import { describe, expect, it } from 'vitest';
import { hasPermission, MembershipRole } from '@compras-ja/shared';

describe('RBAC Compras Já', () => {
  it('admin global não lê propostas sigilosas', () => {
    expect(hasPermission(MembershipRole.GLOBAL_ADMIN, 'proposal:secret:read')).toBe(false);
    expect(hasPermission(MembershipRole.GLOBAL_ADMIN, 'admin:tenants')).toBe(true);
  });

  it('fornecedor autorizado pode enviar proposta e lance', () => {
    expect(hasPermission(MembershipRole.AUTHORIZED_REPRESENTATIVE, 'proposal:submit')).toBe(true);
    expect(hasPermission(MembershipRole.AUTHORIZED_REPRESENTATIVE, 'bid:place')).toBe(true);
  });

  it('leitura não envia proposta', () => {
    expect(hasPermission(MembershipRole.READ_ONLY, 'proposal:submit')).toBe(false);
  });
});
