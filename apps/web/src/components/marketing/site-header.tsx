import Link from 'next/link';
import { ComprasJaLogo, Button } from '@compras-ja/ui';
import { siteConfig } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <ComprasJaLogo size="md" />
        </Link>
        <nav className="hidden items-center gap-7 text-[0.95rem] font-medium text-ink-muted lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-brand-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-ink-muted transition hover:text-brand-navy sm:inline"
          >
            Entrar
          </Link>
          <Link href="/cadastro">
            <Button size="sm" variant="primary" className="bg-brand-navy">
              Criar conta
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
