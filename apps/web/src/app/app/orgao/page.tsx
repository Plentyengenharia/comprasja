import {
  ClipboardList,
  FileStack,
  Gavel,
  LayoutDashboard,
  Scale,
  Settings,
  ShieldCheck,
  ScrollText,
} from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@compras-ja/ui';
import { AppShell } from '@/components/app/app-shell';

const nav = [
  { href: '/app/orgao', label: 'Meu Painel', icon: <LayoutDashboard size={18} /> },
  { href: '/app/orgao/planejamento', label: 'Planejamento', icon: <ClipboardList size={18} /> },
  { href: '/app/orgao/processos', label: 'Processos', icon: <FileStack size={18} /> },
  { href: '/app/orgao/editais', label: 'Editais', icon: <ScrollText size={18} /> },
  { href: '/app/orgao/propostas', label: 'Propostas', icon: <ShieldCheck size={18} /> },
  { href: '/app/orgao/sessoes', label: 'Sessões', icon: <Gavel size={18} /> },
  { href: '/app/orgao/julgamentos', label: 'Julgamentos', icon: <Scale size={18} /> },
  { href: '/app/orgao/configuracoes', label: 'Configurações', icon: <Settings size={18} /> },
];

const indicators = [
  { title: 'Licitações publicadas', value: '—' },
  { title: 'Processos em andamento', value: '—' },
  { title: 'Volume estimado', value: 'R$ —' },
  { title: 'Economia obtida', value: 'R$ —', note: 'Metodologia: diferença estimado × adjudicado' },
  { title: 'Esclarecimentos / Impugnações', value: '0 / 0' },
  { title: 'Contratos', value: '0' },
];

export default function OrgaoDashboard() {
  return (
    <AppShell
      title="Portal do Órgão"
      nav={nav}
      breadcrumbs={[{ label: 'Órgãos públicos' }, { label: 'Meu Painel' }]}
    >
      <h1 className="text-2xl font-semibold text-ink">Painel do órgão público</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Cartões clicáveis serão vinculados às listagens filtradas no Marco 3+. Economia obtida usa
        metodologia explícita (estimado vs. adjudicado).
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {indicators.map((item) => (
          <Card key={item.title}>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
            {'note' in item && item.note ? (
              <p className="mt-2 text-xs text-ink-muted">{item.note}</p>
            ) : null}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
