import { BRAND } from '@compras-ja/shared';

export const siteConfig = {
  ...BRAND,
  nav: [
    { href: '/para-orgaos', label: 'Para órgãos' },
    { href: '/para-fornecedores', label: 'Para fornecedores' },
    { href: '/funcionalidades', label: 'Funcionalidades' },
    { href: '/licitacoes', label: 'Licitações públicas' },
    { href: '/planos', label: 'Planos' },
  ],
  footer: [
    { href: '/sobre', label: 'Sobre nós' },
    { href: '/ajuda', label: 'Central de ajuda' },
    { href: '/contato', label: 'Contato' },
    { href: '/termos', label: 'Termos de Uso' },
    { href: '/privacidade', label: 'Privacidade' },
  ],
};
