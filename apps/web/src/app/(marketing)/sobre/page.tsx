import type { Metadata } from 'next';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Sobre nós' };

export default function Page() {
  return (
    <SimplePage
      title="Sobre o Compras Já"
      lead="Plataforma nacional de tecnologia para compras públicas, com arquitetura própria e foco em segurança, transparência e usabilidade."
    >
      <p className="text-ink-muted">
        Não inventamos métricas de clientes, certificações ou parcerias. A disponibilidade jurídica
        e registral do nome será verificada antes do lançamento comercial.
      </p>
    </SimplePage>
  );
}
