'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob?: string;
  dateOfJoining?: string;
  yogaPlan?: number;
  feesPaid?: string;
  platform?: string;
  approved: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setProfile({
          ...data,
          dob: data.dob ? new Date(data.dob).toLocaleDateString() : undefined,
          dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining).toLocaleDateString() : undefined,
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  return (
    <DashboardShell>
      {loading ? (
        <p>Loading profile…</p>
      ) : profile ? (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Member profile</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Your details</h2>
              </div>
              <div className="rounded-3xl bg-white px-5 py-4 shadow-sm">
                <p className="text-sm text-slate-500">Current status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile.approved ? 'Approved' : 'Pending approval'}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Personal info</h3>
              <div className="mt-6 grid gap-4">
                {[
                  { label: 'Name', value: profile.name },
                  { label: 'Email', value: profile.email },
                  { label: 'Phone', value: profile.phone },
                  { label: 'Date of birth', value: profile.dob || 'Not set' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Membership details</h3>
              <div className="mt-6 grid gap-4">
                {[
                  { label: 'Yoga plan', value: profile.yogaPlan ? `${profile.yogaPlan} month${profile.yogaPlan > 1 ? 's' : ''}` : 'Not selected' },
                  { label: 'Fees paid', value: profile.feesPaid || 'Not set' },
                  { label: 'Platform', value: profile.platform || 'Not set' },
                  { label: 'Date of joining', value: profile.dateOfJoining || 'Not set' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Unable to load profile information.</p>
      )}
    </DashboardShell>
  );
}
