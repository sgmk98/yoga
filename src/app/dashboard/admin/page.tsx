'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function AdminPage() {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPending() {
      const res = await fetch('/api/admin/pending');
      if (res.ok) {
        const data = await res.json();
        setPending(data);
      }
    }
    loadPending();
  }, []);

  const handleApprove = async (userId: string, approved: boolean) => {
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, approved }),
    });
    if (res.ok) {
      setPending((prev) => prev.filter((user) => user._id !== userId));
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, link }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Class added successfully');
      setTitle('');
      setDescription('');
      setLink('');
    } else {
      setError(data.error || 'Unable to add class');
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Admin dashboard</h2>
          <p className="mt-2 text-sm text-gray-600">Approve or reject pending user profiles, and add recorded class links for all users.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Pending profile approvals</h3>
            <div className="mt-4 space-y-4">
              {pending.length ? (
                pending.map((user) => (
                  <div key={user._id} className="rounded-lg border border-gray-200 p-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleApprove(user._id, true)}
                        className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(user._id, false)}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No pending profiles to review.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Add recorded class link</h3>
            <form onSubmit={handleAddClass} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Link</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}
              <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                Add class link
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
