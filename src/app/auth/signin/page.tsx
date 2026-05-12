'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.15),_transparent_35%),linear-gradient(180deg,#fdf2f8_0%,#f8fafc_100%)] px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-10 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/80">
            🧘
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Welcome back</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Sign in to your yoga portal</h2>
          </div>
          <p className="text-sm text-slate-600">Access recorded classes and manage your membership.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center justify-between">
            <Link href="/auth/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Sign in
          </button>
          <p className="text-center text-sm text-slate-600">
            New here?{' '}
            <Link href="/auth/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}