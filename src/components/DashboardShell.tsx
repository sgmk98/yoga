'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Yoga Member Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900 font-medium">
                Home
              </Link>
              <Link href="/dashboard/enrollment" className="text-indigo-600 hover:text-indigo-900 font-medium">
                Enrollment
              </Link>
              <Link href="/dashboard/profile" className="text-indigo-600 hover:text-indigo-900 font-medium">
                Profile
              </Link>
              <Link href="/dashboard/classes" className="text-indigo-600 hover:text-indigo-900 font-medium">
                Recorded Classes
              </Link>
              {session?.user?.role === 'admin' && (
                <Link href="/dashboard/admin" className="text-indigo-600 hover:text-indigo-900 font-medium">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="text-red-600 hover:text-red-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}