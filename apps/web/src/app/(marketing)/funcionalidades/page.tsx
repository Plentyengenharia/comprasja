import type { Metadata } from 'next';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Funcionalidades' };

const features = [
  'Autenticação, MFA e RBAC contextual',
  'Cadastro de órgãos e fornecedores (CNPJ alfanumérico)',
  'Gestão de processos e documentos',
  'Propostas com sigilo e protocolo',
  'Motor de disputas em homologação',
  'Julgamento, habilitação, recursos e contratos',
  'Portal de transparência sem paywall',
  'Integrações PNCP (consulta e publicação desacopladas)',
  'Compras Já Intelligence (opcional)',
];

export default function Page() {
  return (
    <SimplePage
      title="Funcionalidades"
      lead="Módulos integrados para operar licitações eletrônicas com segurança e rastreabilidade."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {features.map((f) => (
          <li key={f} className="border-l-2 border-brand-tech pl-3 text-sm text-ink">
            {f}
          </li>
        ))}
      </ul>
    </SimplePage>
  );
}
