'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.06),_transparent_25%),linear-gradient(180deg,#fffaf5_0%,#f8fafc_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_35px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <div className="border-b border-slate-200 bg-slate-950/95 px-6 py-6 text-white sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Member dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Yoga Studio Portal</h1>
              <p className="mt-2 text-sm text-slate-300">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0 sm:items-center">
              <Link href="/dashboard" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                Home
              </Link>
              <Link href="/dashboard/enrollment" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                Enrollment
              </Link>
              <Link href="/dashboard/profile" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                Profile
              </Link>
              <Link href="/dashboard/classes" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                Classes
              </Link>
              {session?.user?.role === 'admin' && (
                <>
                  <Link href="/dashboard/admin" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                    Admin
                  </Link>
                  <Link href="/dashboard/admin/users" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                    All Users
                  </Link>
                </>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="px-6 py-8 lg:px-10">{children}</div>
        </div>
      </div>
    </div>
  );
}