'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ComprasJaLogo, Input, Label } from '@compras-ja/ui';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Falha no login');
      }
      const data = await res.json();
      localStorage.setItem('cj_access_token', data.accessToken);
      localStorage.setItem('cj_refresh_token', data.refreshToken);
      const type = data.memberships?.[0]?.organizationType;
      if (type === 'PUBLIC_BODY') router.push('/app/orgao');
      else if (type === 'PLATFORM') router.push('/app/admin');
      else router.push('/app/fornecedor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft">
        <ComprasJaLogo size="lg" />
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Entrar</h1>
        <p className="mt-1 text-sm text-ink-muted">Acesse sua conta Compras Já</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-ink-muted">
          Não tem conta?{' '}
          <Link href="/cadastro" className="text-brand-tech hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
