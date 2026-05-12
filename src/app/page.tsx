import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-200 via-violet-100 to-cyan-100 opacity-80" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-800">
              Yoga membership portal
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
              Move mindfully, learn with every class.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Access your recorded sessions, manage your profile, and stay inspired with a calm, modern yoga dashboard.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Create account
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-900/5">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950/95 p-6 text-white shadow-lg">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Ready for your next class?</p>
                <h2 className="mt-4 text-3xl font-semibold">Start your yoga journey today</h2>
              </div>
              <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">🧘</div>
                  <div>
                    <p className="font-semibold text-slate-900">Recorded classes</p>
                    <p className="text-sm text-slate-600">Watch anytime with curated sessions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-2xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center">📅</div>
                  <div>
                    <p className="font-semibold text-slate-900">Profile approval</p>
                    <p className="text-sm text-slate-600">Manage your enrollment and join fast.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">✨</div>
                  <div>
                    <p className="font-semibold text-slate-900">Admin control</p>
                    <p className="text-sm text-slate-600">Approve members and publish classes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
