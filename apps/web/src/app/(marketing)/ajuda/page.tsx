import type { Metadata } from 'next';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Central de ajuda' };

export default function Page() {
  return (
    <SimplePage
      title="Central de ajuda"
      lead="Documentação de suporte em evolução. Use o contato para dúvidas sobre o ambiente demonstrativo."
    >
      <p className="text-ink-muted">
        Artigos e tutoriais serão publicados conforme os marcos forem concluídos.
      </p>
    </SimplePage>
  );
}
