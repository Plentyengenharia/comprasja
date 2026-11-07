import { describe, expect, it } from 'vitest';
import { formatCnpj, isValidCnpjFormat, normalizeCnpj } from './cnpj';

describe('cnpj alfanumérico', () => {
  it('normaliza máscara e maiúsculas', () => {
    expect(normalizeCnpj('12.ABC.345/01DE-35')).toBe('12ABC34501DE35');
  });

  it('valida formato de 14 caracteres', () => {
    expect(isValidCnpjFormat('12ABC34501DE35')).toBe(true);
    expect(isValidCnpjFormat('123')).toBe(false);
  });

  it('formata para máscara padrão', () => {
    expect(formatCnpj('12ABC34501DE35')).toBe('12.ABC.345/01DE-35');
  });
});
