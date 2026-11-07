import Link from 'next/link';
import { ArrowRight, Building2, Lock, Scale, Store } from 'lucide-react';
import { Button, ComprasJaLogo } from '@compras-ja/ui';
import { BRAND } from '@compras-ja/shared';

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(13,148,136,0.45), transparent 55%), radial-gradient(ellipse 60% 50% at 15% 80%, rgba(23,107,154,0.5), transparent 50%), linear-gradient(160deg, #102A43 0%, #0b1c2e 100%)',
          }}
        />
        <div className="relative mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="animate-fade-up mb-6">
              <ComprasJaLogo inverted markClassName="h-10 w-10" className="text-2xl" />
            </div>
            <h1 className="animate-fade-up max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Compras Já. A nova geração das licitações eletrônicas.
            </h1>
            <p className="animate-fade-up-delay mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              Conectamos órgãos públicos e fornecedores em uma plataforma inteligente, segura e
              transparente. Simplifique contratações, descubra oportunidades e transforme a gestão
              das licitações.
            </p>
            <div className="animate-fade-up-delay mt-8 flex flex-wrap gap-3">
              <Link href="/funcionalidades">
                <Button size="lg" variant="secondary">
                  Conhecer a plataforma
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  Criar conta gratuitamente
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-[320px] lg:block">
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-tech/30 via-transparent to-brand-emerald/25 animate-soft-pulse" />
            <div className="absolute inset-6 rounded-[1.5rem] border border-white/15 bg-white/5 backdrop-blur-sm" />
            <div className="absolute bottom-10 left-10 right-10 space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-teal-200/90">Ambiente seguro</p>
              <p className="text-2xl font-medium leading-snug">
                Infraestrutura preparada para transparência, auditoria e disputas em homologação.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold text-ink">Uma plataforma. Cinco ambientes.</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Institucional, fornecedores, órgãos públicos, administração SaaS e portal de transparência
          compartilham a mesma infraestrutura, com isolamento rigoroso entre organizações.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[
            {
              icon: Building2,
              title: 'Órgãos públicos',
              body: 'Planeje, publique, conduza sessões e homologie com trilhas de auditoria.',
              href: '/para-orgaos',
            },
            {
              icon: Store,
              title: 'Fornecedores',
              body: 'Encontre oportunidades, organize documentos e acompanhe propostas e contratos.',
              href: '/para-fornecedores',
            },
            {
              icon: Scale,
              title: 'Transparência',
              body: 'Consulta pública a editais, resultados e contratos divulgáveis, sem paywall.',
              href: '/transparencia',
            },
            {
              icon: Lock,
              title: 'Segurança e conformidade',
              body: 'RBAC, MFA, sigilo de propostas e alinhamento à Lei 14.133/2021.',
              href: '/funcionalidades',
            },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group block border-t border-line pt-6">
              <item.icon className="h-6 w-6 text-brand-tech" />
              <h3 className="mt-4 text-xl font-semibold text-ink group-hover:text-brand-tech">
                {item.title}
              </h3>
              <p className="mt-2 text-ink-muted">{item.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-semibold text-ink">Por que {BRAND.name}</h2>
          <p className="mt-3 max-w-2xl text-ink-muted">
            Desenhado para o mercado brasileiro de compras públicas, com motor de disputas
            transacional, integrações preparadas para o PNCP e operação SaaS.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              'Relógio do servidor autoritativo para lances e prazos',
              'Multitenancy com permissões no backend',
              'Publicação oficial PNCP desativável até credenciamento',
            ].map((text) => (
              <li key={text} className="border-l-2 border-brand-emerald pl-4 text-sm text-ink">
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href="/planos">
              <Button>Ver planos</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
