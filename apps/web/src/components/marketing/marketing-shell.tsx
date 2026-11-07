import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
