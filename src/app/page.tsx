import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 shadow-xl">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-semibold text-gray-900">Yoga Class App</h1>
          <p className="text-lg text-gray-600">
            A simple client portal for yoga class enrollment, recorded classes, and admin approvals.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/auth/signin"
              className="rounded-xl bg-indigo-600 py-4 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl border border-indigo-600 py-4 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
