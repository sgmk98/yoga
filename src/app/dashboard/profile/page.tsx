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
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Your profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="mt-1 text-gray-900">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="mt-1 text-gray-900">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="mt-1 text-gray-900">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Approval status</p>
                <p className="mt-1 text-gray-900">{profile.approved ? 'Approved' : 'Pending approval'}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Date of birth</p>
                <p className="mt-1 text-gray-900">{profile.dob || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Date of joining</p>
                <p className="mt-1 text-gray-900">{profile.dateOfJoining || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Yoga plan</p>
                <p className="mt-1 text-gray-900">{profile.yogaPlan ? `${profile.yogaPlan} month${profile.yogaPlan > 1 ? 's' : ''}` : 'Not selected'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Fees paid</p>
                <p className="mt-1 text-gray-900">{profile.feesPaid || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Platform</p>
                <p className="mt-1 text-gray-900">{profile.platform || 'Not set'}</p>
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
