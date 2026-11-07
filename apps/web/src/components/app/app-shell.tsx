'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Search,
  Moon,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { ComprasJaLogo, cn, Input } from '@compras-ja/ui';

export type NavItem = { href: string; label: string; icon?: React.ReactNode };

export function AppShell({
  title,
  nav,
  children,
  breadcrumbs = [],
}: {
  title: string;
  nav: NavItem[];
  children: React.ReactNode;
  breadcrumbs?: { href?: string; label: string }[];
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-line bg-brand-navy text-white transition-all lg:static',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <ComprasJaLogo inverted showWordmark={!collapsed} markClassName="h-7 w-7" />
          <button
            type="button"
            className="hidden rounded-lg p-1 hover:bg-white/10 lg:inline-flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-3">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                  active ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white',
                )}
              >
                {item.icon ?? <LayoutDashboard size={18} />}
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3 text-xs text-white/60">
          {!collapsed ? title : 'CJ'}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur dark:bg-[var(--cj-white)]/90">
          <button
            type="button"
            className="rounded-lg border border-line p-2 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input className="pl-9" placeholder="Pesquisa global..." aria-label="Pesquisa global" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-line p-2 text-ink-muted hover:text-ink"
              onClick={toggleDark}
              aria-label="Alternar tema"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="rounded-xl border border-line p-2 text-ink-muted hover:text-ink"
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="border-b border-line bg-white px-4 py-3 text-sm dark:bg-[var(--cj-white)]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-ink-muted">
            <Link href="/" className="hover:text-ink">
              Compras Já
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1">
                <span>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
