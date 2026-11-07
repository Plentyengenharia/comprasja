import type { Metadata } from 'next';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Termos de Uso' };

export default function Page() {
  return (
    <SimplePage
      title="Termos de Uso"
      lead="Versão provisória para o ambiente demonstrativo. A versão jurídica definitiva será publicada antes da operação comercial."
    >
      <p className="text-sm text-ink-muted">
        O uso do ambiente demo não constitui participação em certame oficial nem credenciamento junto
        a órgãos públicos.
      </p>
    </SimplePage>
  );
}
