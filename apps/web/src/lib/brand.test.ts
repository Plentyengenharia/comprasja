import { describe, expect, it } from 'vitest';
import { BRAND } from '@compras-ja/shared';

describe('marca web', () => {
  it('usa Compras Já', () => {
    expect(BRAND.name).toBe('Compras Já');
    expect(BRAND.slug).toBe('compras-ja');
  });
});
