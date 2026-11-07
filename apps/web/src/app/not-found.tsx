import Link from 'next/link';
import { Button, ComprasJaLogo } from '@compras-ja/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted px-4">
      <ComprasJaLogo />
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-ink-muted">O endereço solicitado não existe no Compras Já.</p>
      <Link href="/">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  );
}
