import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000';
  const paths = [
    '/',
    '/para-orgaos',
    '/para-fornecedores',
    '/funcionalidades',
    '/licitacoes',
    '/planos',
    '/sobre',
    '/ajuda',
    '/contato',
    '/login',
    '/cadastro',
    '/termos',
    '/privacidade',
    '/transparencia',
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
