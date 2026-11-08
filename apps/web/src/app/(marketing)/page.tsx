import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { Button, ComprasJaLogo } from '@compras-ja/ui';
import { BRAND, formatBrl } from '@compras-ja/shared';
import { apiGet } from '@/lib/api';

type PublicList = {
  items: Array<{
    id: string;
    processNumber: string;
    objectTitle: string;
    modality: string;
    status: string;
    estimatedValue: string;
    organization: { legalName: string; city: string | null; state: string | null };
  }>;
};

export default async function HomePage() {
  let live: PublicList | null = null;
  try {
    live = await apiGet<PublicList>('/procurements/public?pageSize=3', { cache: 'no-store' });
  } catch {
    live = null;
  }

  return (
    <>
      {/* Hero — uma composição, brand first, full-bleed */}
      <section className="relative overflow-hidden cj-mesh">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-drift absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-emerald/25 blur-3xl" />
          <div className="animate-drift absolute -right-10 top-0 h-96 w-96 rounded-full bg-brand-tech/30 blur-3xl [animation-delay:1.2s]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
          <div className="animate-fade-up mb-5">
            <ComprasJaLogo size="lg" />
          </div>

          <p className="animate-fade-up font-display text-xs font-semibold uppercase tracking-[0.22em] text-brand-tech sm:text-sm">
            {BRAND.slogan}
          </p>

          <h1 className="animate-fade-up-delay mt-4 max-w-4xl font-display text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.04em] text-brand-navy sm:text-5xl lg:text-[3.75rem]">
            Compras Já. A nova geração das{' '}
            <span className="cj-text-gradient">licitações eletrônicas</span>.
          </h1>

          <p className="animate-fade-up-delay mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Conectamos órgãos públicos e fornecedores em uma plataforma inteligente, segura e
            transparente. Simplifique contratações, descubra oportunidades e transforme a gestão
            das licitações.
          </p>

          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <Link href="/funcionalidades">
              <Button size="lg" variant="secondary">
                Conhecer a plataforma
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="lg" variant="primary">
                Criar conta gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Duas conversas / dois públicos */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-emerald">
            Uma plataforma, duas jornadas
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-[-0.03em] text-brand-navy sm:text-4xl">
            Escolha o seu lado da mesa. O Compras Já acompanha o processo inteiro.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Link
              href="/para-orgaos"
              className="group relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-[#f4faf9] to-white p-8 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <Building2 className="h-8 w-8 text-brand-tech" />
              <h3 className="mt-6 font-display text-2xl font-semibold text-brand-navy">
                Para órgãos públicos
              </h3>
              <p className="mt-3 text-ink-muted">
                Planejamento, editais, sessões, julgamento, habilitação, recursos e contratos com
                trilha de auditoria.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-tech">
                Ver jornada do órgão <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/para-fornecedores"
              className="group relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-[#f3f8fc] to-white p-8 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <Store className="h-8 w-8 text-brand-emerald" />
              <h3 className="mt-6 font-display text-2xl font-semibold text-brand-navy">
                Para fornecedores
              </h3>
              <p className="mt-3 text-ink-muted">
                Oportunidades, cofre documental, propostas com protocolo e acompanhamento de
                disputas e contratos.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-emerald">
                Ver jornada do fornecedor{' '}
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Princípios — estilo moderno, sem cards de métricas inventadas */}
      <section className="relative overflow-hidden cj-mesh-dark text-white">
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-brand-gold-bright" />
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold-bright/90">
              Tecnologia com controle humano
            </p>
          </div>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            A plataforma executa o trabalho pesado. A decisão continua com você.
          </h2>

          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                n: '01',
                title: 'Execução assistida',
                body: 'Fluxos, validações e registros nas etapas da Lei 14.133 — sem decisões administrativas autônomas por IA.',
              },
              {
                n: '02',
                title: 'Auditoria nativa',
                body: 'Permissões no backend, trilhas com integridade e isolamento rigoroso entre organizações.',
              },
              {
                n: '03',
                title: 'Transparência real',
                body: 'Consulta pública sem paywall para o que deve ser público. Sigilo respeitado até o momento legal.',
              },
            ].map((item) => (
              <li key={item.n} className="border-t border-white/15 pt-6">
                <p className="font-display text-sm font-semibold text-brand-gold-bright/90">{item.n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Licitações do banco — sem inventar dados */}
      <section className="bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-tech">
                Transparência
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-brand-navy sm:text-4xl">
                Processos públicos no Compras Já
              </h2>
              <p className="mt-3 max-w-xl text-ink-muted">
                Lista alimentada pelo banco. Sem métricas inventadas e sem paywall para informação
                pública.
              </p>
            </div>
            <Link href="/transparencia">
              <Button variant="outline">Abrir portal</Button>
            </Link>
          </div>

          <ul className="mt-10 divide-y divide-line overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-soft">
            {live?.items?.length ? (
              live.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/transparencia/${item.id}`}
                    className="flex flex-col gap-2 px-6 py-5 transition hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-tech">
                        {item.modality} · {item.status}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-brand-navy">
                        {item.objectTitle}
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">
                        {item.processNumber} · {item.organization.legalName}
                        {item.organization.state
                          ? ` · ${item.organization.city}/${item.organization.state}`
                          : ''}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-ink">
                      {formatBrl(item.estimatedValue)}
                    </p>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-6 py-10 text-sm text-ink-muted">
                Inicie a API e o banco para listar processos públicos reais aqui.
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] cj-mesh-dark px-8 py-14 text-white sm:px-12">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/40 via-transparent to-brand-emerald/20" />
            <div className="relative max-w-2xl">
              <ShieldCheck className="h-8 w-8 text-brand-gold-bright" />
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                O sistema trabalha para você. Comece no ambiente demonstrativo.
              </h2>
              <p className="mt-4 text-white/75">
                Cadastre-se, explore os portais e valide os fluxos. Recursos oficiais permanecem
                bloqueados até homologação jurídica e técnica.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/cadastro">
                  <Button size="lg" variant="secondary">
                    Criar conta gratuitamente
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/25 bg-transparent text-white hover:bg-white/10"
                  >
                    Falar com a equipe
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
