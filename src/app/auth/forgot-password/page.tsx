'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Reset link sent to your email. Check the console for the link.');
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.12),_transparent_30%),linear-gradient(180deg,#fdf2f8_0%,#f8fafc_100%)] px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-10 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Reset password</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Forgot your password?</h2>
          <p className="text-sm text-slate-600">
            Enter your email and we’ll send you a secure reset link.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-3 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Send reset link
          </button>
          <p className="text-center text-sm text-slate-600">
            Back to{' '}
            <Link href="/auth/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
              sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}