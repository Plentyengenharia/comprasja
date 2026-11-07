import type { Metadata } from 'next';
import Link from 'next/link';
import { formatBrl } from '@compras-ja/shared';
import { Badge, ComprasJaLogo, EmptyState } from '@compras-ja/ui';
import { apiGet } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Portal de Transparência | Compras Já',
  description: 'Consulta pública a licitações, editais e resultados divulgáveis.',
};

type PublicList = {
  items: Array<{
    id: string;
    processNumber: string;
    objectTitle: string;
    modality: string;
    status: string;
    estimatedValue: string;
    organization: { legalName: string; city: string | null; state: string | null };
  }>;
  total: number;
};

export default async function TransparenciaPage() {
  let data: PublicList | null = null;
  try {
    data = await apiGet<PublicList>('/procurements/public?pageSize=50', { cache: 'no-store' });
  } catch {
    data = null;
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/">
            <ComprasJaLogo />
          </Link>
          <Link href="/licitacoes" className="text-sm text-brand-tech">
            Voltar ao site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-ink">Portal de Transparência</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Pesquisa pública sem necessidade de assinatura. Sigilo temporário e dados pessoais
          protegidos conforme a legislação.
        </p>

        {!data ? (
          <EmptyState
            className="mt-12 rounded-xl border border-line bg-white"
            title="API indisponível"
            description="Inicie PostgreSQL e a API Compras Já para carregar processos públicos do banco."
          />
        ) : data.items.length === 0 ? (
          <EmptyState
            className="mt-12 rounded-xl border border-line bg-white"
            title="Nenhum processo público"
            description="Quando houver publicações, elas aparecerão aqui automaticamente."
          />
        ) : (
          <ul className="mt-8 divide-y divide-line rounded-xl border border-line bg-white">
            {data.items.map((item) => (
              <li key={item.id} className="p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="tech">{item.modality}</Badge>
                  <Badge tone="success">{item.status}</Badge>
                </div>
                <Link
                  href={`/transparencia/${item.id}`}
                  className="mt-2 block text-lg font-semibold text-ink hover:text-brand-tech"
                >
                  {item.objectTitle}
                </Link>
                <p className="mt-1 text-sm text-ink-muted">
                  {item.processNumber} · {item.organization.legalName}
                  {item.organization.state
                    ? ` · ${item.organization.city}/${item.organization.state}`
                    : ''}
                </p>
                <p className="mt-1 text-sm">Valor estimado: {formatBrl(item.estimatedValue)}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
