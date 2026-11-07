import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@compras-ja/ui';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Para órgãos públicos' };

export default function Page() {
  return (
    <SimplePage
      title="Para órgãos públicos"
      lead="Planejamento, editais, propostas, sessões, julgamento, habilitação, recursos, homologação e contratos em um fluxo auditável."
    >
      <ul className="list-disc space-y-2 pl-5 text-ink-muted">
        <li>Máquina de estados de processos com validações e permissões</li>
        <li>Equipes com papéis da Lei 14.133/2021</li>
        <li>Indicadores de volume, prazos e pendências</li>
      </ul>
      <Link href="/cadastro">
        <Button className="mt-4">Criar conta institucional</Button>
      </Link>
    </SimplePage>
  );
}
