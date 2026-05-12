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

export default function EnrollmentPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setProfile({
          ...data,
          dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : undefined,
          dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString().slice(0, 10) : undefined,
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!profile) return;

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dob: profile.dob,
        dateOfJoining: profile.dateOfJoining,
        yogaPlan: profile.yogaPlan,
        feesPaid: profile.feesPaid,
        platform: profile.platform,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message || 'Enrollment details saved.');
    } else {
      setError(data.error || 'Unable to save enrollment details.');
    }
  };

  const updateField = (key: keyof UserProfile, value: string | number | undefined) => {
    setProfile((current) => (current ? { ...current, [key]: value } : current));
  };

  return (
    <DashboardShell>
      {loading ? (
        <p>Loading enrollment form…</p>
      ) : profile ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input disabled value={profile.name} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input disabled value={profile.email} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input disabled value={profile.phone} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of birth
              </label>
              <input
                id="dob"
                type="date"
                value={profile.dob || ''}
                onChange={(e) => updateField('dob', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700">
                Date of joining
              </label>
              <input
                id="dateOfJoining"
                type="date"
                value={profile.dateOfJoining || ''}
                onChange={(e) => updateField('dateOfJoining', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Yoga plan</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-4">
              {[1, 3, 6, 12].map((plan) => (
                <label key={plan} className="flex items-center gap-2 rounded-lg border border-gray-300 p-3">
                  <input
                    type="radio"
                    name="yogaPlan"
                    value={plan}
                    checked={profile.yogaPlan === plan}
                    onChange={() => updateField('yogaPlan', plan)}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span>{plan} month{plan > 1 ? 's' : ''}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Fees paid</p>
              <div className="mt-2 space-y-2">
                {['cash', 'online'].map((option) => (
                  <label key={option} className="flex items-center gap-2 rounded-lg border border-gray-300 p-3">
                    <input
                      type="radio"
                      name="feesPaid"
                      value={option}
                      checked={profile.feesPaid === option}
                      onChange={() => updateField('feesPaid', option)}
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Platform</p>
              <div className="mt-2 space-y-2">
                {['online', 'offline'].map((option) => (
                  <label key={option} className="flex items-center gap-2 rounded-lg border border-gray-300 p-3">
                    <input
                      type="radio"
                      name="platform"
                      value={option}
                      checked={profile.platform === option}
                      onChange={() => updateField('platform', option)}
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Save enrollment details
          </button>
        </form>
      ) : (
        <p>Unable to load enrollment data.</p>
      )}
    </DashboardShell>
  );
}
