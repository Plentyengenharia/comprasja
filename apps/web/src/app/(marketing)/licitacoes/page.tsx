import type { Metadata } from 'next';
import Link from 'next/link';
import { formatBrl } from '@compras-ja/shared';
import { Badge } from '@compras-ja/ui';
import { apiGet } from '@/lib/api';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Licitações públicas' };

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
};

export default async function Page() {
  let data: PublicList | null = null;
  let error: string | null = null;

  try {
    data = await apiGet<PublicList>('/procurements/public', { cache: 'no-store' });
  } catch {
    error =
      'Não foi possível carregar licitações da API. Inicie o backend e o banco para listar dados reais.';
  }

  return (
    <SimplePage
      title="Licitações públicas"
      lead="Consulta a processos publicados no Compras Já. Informações públicas não exigem assinatura comercial."
    >
      {error ? <p className="text-sm text-warning">{error}</p> : null}
      {data?.items?.length ? (
        <ul className="divide-y divide-line">
          {data.items.map((item) => (
            <li key={item.id} className="py-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="tech">{item.modality}</Badge>
                <Badge>{item.status}</Badge>
              </div>
              <Link href={`/transparencia/${item.id}`} className="mt-2 block text-lg font-semibold hover:text-brand-tech">
                {item.objectTitle}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">
                {item.processNumber} · {item.organization.legalName}
                {item.organization.city ? ` · ${item.organization.city}/${item.organization.state}` : ''}
              </p>
              <p className="mt-1 text-sm text-ink">Estimado: {formatBrl(item.estimatedValue)}</p>
            </li>
          ))}
        </ul>
      ) : !error ? (
        <p className="text-sm text-ink-muted">Nenhuma licitação pública disponível no momento.</p>
      ) : null}
    </SimplePage>
  );
}
