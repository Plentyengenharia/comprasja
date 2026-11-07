import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatBrl } from '@compras-ja/shared';
import { Badge, ComprasJaLogo } from '@compras-ja/ui';
import { apiGet } from '@/lib/api';

type ProcessDetail = {
  id: string;
  processNumber: string;
  objectTitle: string;
  objectDescription: string;
  modality: string;
  status: string;
  estimatedValue: string;
  legalRegime: string;
  organization: { legalName: string; city: string | null; state: string | null };
  lots: Array<{
    id: string;
    lotNumber: number;
    title: string;
    estimatedValue: string;
    items: Array<{ itemNumber: number; description: string; quantity: string; unit: string }>;
  }>;
};

export const metadata: Metadata = { title: 'Processo público' };

export default async function ProcessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let process: ProcessDetail | null = null;
  try {
    process = await apiGet<ProcessDetail>(`/procurements/public/${id}`, { cache: 'no-store' });
  } catch {
    notFound();
  }
  if (!process) notFound();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/transparencia">
            <ComprasJaLogo />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          <Badge tone="tech">{process.modality}</Badge>
          <Badge>{process.status}</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-ink">{process.objectTitle}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {process.processNumber} · {process.organization.legalName} · {process.legalRegime}
        </p>
        <p className="mt-6 text-ink">{process.objectDescription}</p>
        <p className="mt-4 font-medium">Estimado: {formatBrl(process.estimatedValue)}</p>
        <h2 className="mt-10 text-xl font-semibold">Lotes</h2>
        <ul className="mt-4 space-y-4">
          {process.lots.map((lot) => (
            <li key={lot.id} className="rounded-xl border border-line bg-white p-4">
              <p className="font-medium">
                Lote {lot.lotNumber} — {lot.title}
              </p>
              <p className="text-sm text-ink-muted">Estimado: {formatBrl(lot.estimatedValue)}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink-muted">
                {lot.items.map((item) => (
                  <li key={item.itemNumber}>
                    {item.itemNumber}. {item.description} — {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
