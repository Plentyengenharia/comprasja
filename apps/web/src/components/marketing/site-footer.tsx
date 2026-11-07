import Link from 'next/link';
import { ComprasJaLogo } from '@compras-ja/ui';
import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <ComprasJaLogo />
          <p className="mt-3 text-sm text-ink-muted">{siteConfig.slogan}</p>
          <p className="mt-4 text-xs text-ink-muted">
            Referência legislativa: {siteConfig.legalReference}. Ambiente demonstrativo — certames
            oficiais dependem de validação jurídica e técnica.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold text-ink">Produto</p>
            <ul className="mt-3 space-y-2 text-ink-muted">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Institucional</p>
            <ul className="mt-3 space-y-2 text-ink-muted">
              {siteConfig.footer.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Portais</p>
            <ul className="mt-3 space-y-2 text-ink-muted">
              <li>
                <Link href="/app/fornecedor" className="hover:text-ink">
                  Fornecedores
                </Link>
              </li>
              <li>
                <Link href="/app/orgao" className="hover:text-ink">
                  Órgãos públicos
                </Link>
              </li>
              <li>
                <Link href="/transparencia" className="hover:text-ink">
                  Transparência
                </Link>
              </li>
              <li>
                <Link href="/app/admin" className="hover:text-ink">
                  Administração
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
