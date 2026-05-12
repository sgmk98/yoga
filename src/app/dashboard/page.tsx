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
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Welcome, {profile.name}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email: {profile.email}
            </p>
            <p className="mt-2 text-sm text-gray-600">Phone: {profile.phone}</p>
            <p className="mt-4 text-sm font-medium text-gray-800">
              {profile.approved
                ? 'Your profile is approved. You can access recorded classes and enrollment details.'
                : 'Your profile approval is pending. An admin must approve your profile before full access is granted.'}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Recorded Classes</h3>
              <p className="mt-2 text-sm text-gray-600">View the latest yoga class links added by the admin.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              <p className="mt-2 text-sm text-gray-600">Update your details and check approval status.</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Unable to load profile.</p>
      )}
    </DashboardShell>
  );
}
