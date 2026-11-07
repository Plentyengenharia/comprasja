import { z } from 'zod';

/** Valores monetários como string decimal para evitar float. */
export const moneySchema = z
  .string()
  .regex(/^\d+(\.\d{1,4})?$/, 'Valor monetário inválido')
  .or(z.number().finite().nonnegative().transform((n) => n.toFixed(4)));

export function formatBrl(value: string | number, locale = 'pt-BR'): string {
  const amount = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}
