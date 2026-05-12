'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess('Account created successfully. Please sign in.');
      setTimeout(() => router.push('/auth/signin'), 2000);
    } else {
      setError(data.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.12),_transparent_32%),linear-gradient(180deg,#fdf2f8_0%,#f8fafc_100%)] px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-10 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-fuchsia-50 text-fuchsia-700 shadow-sm shadow-fuchsia-100/80">
            ✨
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-600">Join the flow</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Create your yoga account</h2>
          </div>
          <p className="text-sm text-slate-600">Start your enrollment and save your practice details with ease.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}