import { describe, expect, it } from 'vitest';
import { BRAND } from '@compras-ja/shared';

describe('worker', () => {
  it('carrega marca Compras Já', () => {
    expect(BRAND.name).toBe('Compras Já');
  });
});
