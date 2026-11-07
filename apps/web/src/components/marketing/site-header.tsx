import Link from 'next/link';
import { ComprasJaLogo, Button } from '@compras-ja/ui';
import { siteConfig } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <ComprasJaLogo inverted />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/80 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden text-sm text-white/85 sm:inline hover:text-white">
            Entrar
          </Link>
          <Link href="/cadastro">
            <Button size="sm" variant="secondary">
              Criar conta
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
