import {
  Calendar,
  FileText,
  Gavel,
  Heart,
  LayoutDashboard,
  ScrollText,
  Target,
} from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@compras-ja/ui';
import { AppShell } from '@/components/app/app-shell';

const nav = [
  { href: '/app/fornecedor', label: 'Meu painel', icon: <LayoutDashboard size={18} /> },
  { href: '/app/fornecedor/oportunidades', label: 'Oportunidades', icon: <Target size={18} /> },
  { href: '/app/fornecedor/propostas', label: 'Propostas', icon: <FileText size={18} /> },
  { href: '/app/fornecedor/sessoes', label: 'Sessões', icon: <Gavel size={18} /> },
  { href: '/app/fornecedor/documentos', label: 'Cofre documental', icon: <ScrollText size={18} /> },
  { href: '/app/fornecedor/contratos', label: 'Contratos', icon: <Calendar size={18} /> },
  { href: '/app/fornecedor/favoritos', label: 'Favoritos', icon: <Heart size={18} /> },
];

const indicators = [
  { title: 'Oportunidades compatíveis', value: '—', note: 'Aguardando sincronização / filtros CNAE' },
  { title: 'Propostas em elaboração', value: '0', note: 'Dados do banco da organização' },
  { title: 'Propostas enviadas', value: '0', note: 'Com protocolo' },
  { title: 'Sessões agendadas', value: '0', note: 'Homologação apenas' },
  { title: 'Contratos ativos', value: '0', note: 'Após homologação' },
  { title: 'Alertas documentais', value: '0', note: 'Validade de certidões' },
];

export default function FornecedorDashboard() {
  return (
    <AppShell
      title="Portal do Fornecedor"
      nav={nav}
      breadcrumbs={[{ label: 'Fornecedores' }, { label: 'Meu painel' }]}
    >
      <h1 className="text-2xl font-semibold text-ink">Painel do fornecedor</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Indicadores conectados ao banco. Valores permanecem zero até haver operações reais da
        organização autenticada.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {indicators.map((item) => (
          <Card key={item.title}>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
            <p className="mt-2 text-xs text-ink-muted">{item.note}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
