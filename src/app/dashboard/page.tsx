'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  approved: boolean;
  role: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  return (
    <DashboardShell>
      {loading ? (
        <p>Loading your dashboard…</p>
      ) : profile ? (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Hello</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back, {profile.name}</h2>
              </div>
              <div className="rounded-3xl bg-white px-5 py-4 shadow-sm">
                <p className="text-sm text-slate-500">Approval status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile.approved ? 'Approved' : 'Pending approval'}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{profile.email}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{profile.phone}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{profile.role}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Recorded Classes</h3>
              <p className="mt-3 text-sm text-slate-600">Browse all the latest class recordings published by the admin.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Profile</h3>
              <p className="mt-3 text-sm text-slate-600">Update your enrollment details, plan, and membership settings.</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Unable to load profile.</p>
      )}
    </DashboardShell>
  );
}
