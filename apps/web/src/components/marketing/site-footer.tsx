import Link from 'next/link';
import { ComprasJaLogo } from '@compras-ja/ui';
import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-brand-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <ComprasJaLogo inverted size="lg" />
          <p className="mt-4 text-sm leading-relaxed text-white/70">{siteConfig.slogan}</p>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            Referência legislativa: {siteConfig.legalReference}. Ambiente demonstrativo — certames
            oficiais dependem de validação jurídica e técnica.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="font-display font-semibold text-white">Produto</p>
            <ul className="mt-4 space-y-2.5 text-white/65">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display font-semibold text-white">Institucional</p>
            <ul className="mt-4 space-y-2.5 text-white/65">
              {siteConfig.footer.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display font-semibold text-white">Portais</p>
            <ul className="mt-4 space-y-2.5 text-white/65">
              <li>
                <Link href="/app/fornecedor" className="hover:text-white">
                  Fornecedores
                </Link>
              </li>
              <li>
                <Link href="/app/orgao" className="hover:text-white">
                  Órgãos públicos
                </Link>
              </li>
              <li>
                <Link href="/transparencia" className="hover:text-white">
                  Transparência
                </Link>
              </li>
              <li>
                <Link href="/app/admin" className="hover:text-white">
                  Administração
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
