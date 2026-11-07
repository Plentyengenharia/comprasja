import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@compras-ja/ui';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Para fornecedores' };

export default function Page() {
  return (
    <SimplePage
      title="Para fornecedores"
      lead="Identifique oportunidades, organize o cofre documental, prepare propostas e acompanhe disputas e contratos."
    >
      <ul className="list-disc space-y-2 pl-5 text-ink-muted">
        <li>Busca com filtros por objeto, modalidade, órgão, UF e valor</li>
        <li>Alertas de prazos e validade de certidões</li>
        <li>Protocolo de envio com trilha de auditoria</li>
      </ul>
      <Link href="/cadastro">
        <Button className="mt-4">Começar gratuitamente</Button>
      </Link>
    </SimplePage>
  );
}
