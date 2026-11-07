import type { Metadata } from 'next';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Contato' };

export default function Page() {
  return (
    <SimplePage
      title="Contato"
      lead="Canal institucional para dúvidas comerciais e suporte. Endereços e canais oficiais serão publicados quando configurados pelo proprietário."
    >
      <p className="text-sm text-ink-muted">
        O envio de mensagens requer integração de e-mail configurada. Enquanto isso, utilize o canal
        indicado pelo operador da plataforma.
      </p>
    </SimplePage>
  );
}
