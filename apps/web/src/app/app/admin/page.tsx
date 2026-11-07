import { Building2, Flag, LayoutDashboard, Shield, Users, Wallet } from 'lucide-react';
import { Badge, Card, CardDescription, CardTitle } from '@compras-ja/ui';
import { AppShell } from '@/components/app/app-shell';

const nav = [
  { href: '/app/admin', label: 'Visão geral', icon: <LayoutDashboard size={18} /> },
  { href: '/app/admin/tenants', label: 'Clientes', icon: <Building2 size={18} /> },
  { href: '/app/admin/usuarios', label: 'Usuários', icon: <Users size={18} /> },
  { href: '/app/admin/financeiro', label: 'Financeiro', icon: <Wallet size={18} /> },
  { href: '/app/admin/flags', label: 'Feature flags', icon: <Flag size={18} /> },
  { href: '/app/admin/auditoria', label: 'Auditoria', icon: <Shield size={18} /> },
];

export default function AdminPage() {
  return (
    <AppShell
      title="Compras Já Admin"
      nav={nav}
      breadcrumbs={[{ label: 'Administração' }, { label: 'Visão geral' }]}
    >
      <h1 className="text-2xl font-semibold text-ink">Administração SaaS</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Indicadores reais via <code>/api/v1/admin/overview</code> (requer papel GLOBAL_ADMIN). MRR/ARR
        permanecem zerados até provedor de pagamento.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          'Órgãos',
          'Fornecedores',
          'Usuários',
          'Assinaturas ativas',
          'Licitações',
          'Sessões',
          'MRR',
          'ARR',
        ].map((label) => (
          <Card key={label}>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="mt-2 text-3xl">—</CardTitle>
          </Card>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Badge tone="warning">PNCP publicação: desativada</Badge>
        <Badge tone="warning">Certames oficiais: desativados</Badge>
        <Badge tone="tech">Ambiente demonstrativo</Badge>
      </div>
    </AppShell>
  );
}
