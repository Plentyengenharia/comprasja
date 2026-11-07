import type { Metadata } from 'next';
import { SimplePage } from '@/components/marketing/simple-page';

export const metadata: Metadata = { title: 'Política de Privacidade' };

export default function Page() {
  return (
    <SimplePage
      title="Política de Privacidade"
      lead="Tratamento de dados pessoais alinhado à LGPD. Documento jurídico completo será publicado com o lançamento comercial."
    >
      <p className="text-sm text-ink-muted">
        Dados de demonstração devem ser fictícios. Não utilize dados sensíveis reais neste ambiente
        até a homologação de segurança.
      </p>
    </SimplePage>
  );
}
