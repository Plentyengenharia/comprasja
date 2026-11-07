import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@compras-ja/ui';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Planos' };

const plans = [
  { name: 'Público gratuito', price: 'R$ 0', note: 'Consulta pública e cadastro básico' },
  { name: 'Start', price: 'A partir de R$ 149,90/mês', note: 'Fornecedores iniciantes' },
  { name: 'Pro', price: 'A partir de R$ 399,90/mês', note: 'Equipes comerciais' },
  { name: 'Business', price: 'A partir de R$ 899,90/mês', note: 'Multi-CNPJ e API' },
  { name: 'Enterprise', price: 'Sob consulta', note: 'SLA e integrações dedicadas' },
];

export default function Page() {
  return (
    <SimplePage
      title="Planos"
      lead="Planos comerciais editáveis. Informações legalmente públicas não são restritas por paywall. Valores sujeitos a configuração comercial."
    >
      <div className="space-y-6">
        {plans.map((plan) => (
          <div key={plan.name} className="flex flex-col gap-1 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-sm text-ink-muted">{plan.note}</p>
            </div>
            <p className="text-brand-tech">{plan.price}</p>
          </div>
        ))}
      </div>
      <Link href="/contato">
        <Button className="mt-8">Falar com comercial</Button>
      </Link>
    </SimplePage>
  );
}
