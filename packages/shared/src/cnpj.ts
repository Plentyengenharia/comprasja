import { z } from 'zod';

/**
 * Preparado para CNPJ alfanumérico (padrão vigente a partir de 2026).
 * Aceita 14 caracteres alfanuméricos (A-Z / 0-9), com ou sem máscara.
 */
const CNPJ_BODY = /^[A-Z0-9]{14}$/i;
const CNPJ_MASKED =
  /^[A-Z0-9]{2}\.?[A-Z0-9]{3}\.?[A-Z0-9]{3}\/?[A-Z0-9]{4}-?[A-Z0-9]{2}$/i;

export function normalizeCnpj(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export function isValidCnpjFormat(value: string): boolean {
  const raw = normalizeCnpj(value);
  return CNPJ_BODY.test(raw);
}

export function formatCnpj(value: string): string {
  const raw = normalizeCnpj(value);
  if (raw.length !== 14) return value;
  return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8, 12)}-${raw.slice(12)}`;
}

export const cnpjSchema = z
  .string()
  .min(14)
  .refine((v) => CNPJ_MASKED.test(v) || CNPJ_BODY.test(normalizeCnpj(v)), {
    message: 'CNPJ inválido (formato alfanumérico de 14 caracteres)',
  })
  .transform(normalizeCnpj);
