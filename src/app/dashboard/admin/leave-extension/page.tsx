'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfJoining?: string;
  paymentDueDate?: string;
  leaveExtensionDays?: number;
}

export default function LeaveExtensionPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [extensionDays, setExtensionDays] = useState('1');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setLoading(false);
    }
    loadUsers();
  }, []);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u._id));
    }
  };

  const applyExtension = async () => {
    if (selectedUsers.length === 0 || !extensionDays) {
      setMessage('Please select users and enter extension days');
      return;
    }

    try {
      const res = await fetch('/api/admin/leave-extension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers,
          extensionDays: parseInt(extensionDays),
        }),
      });

      if (res.ok) {
        setMessage(`✓ Payment dates extended by ${extensionDays} days for ${selectedUsers.length} users${reason ? ` (Reason: ${reason})` : ''}`);
        setSelectedUsers([]);
        setExtensionDays('1');
        setReason('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Instructor Leave</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Extend Payment Dates</h2>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Extension Days</label>
                <input
                  type="number"
                  min="1"
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(e.target.value)}
                  className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Reason (optional)</label>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Instructor leave, Holiday closure"
                  className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
                />
              </div>
            </div>
            {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-slate-900">{selectedUsers.length} user(s) selected</p>
            <button
              onClick={selectAll}
              className="rounded-full bg-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-400"
            >
              {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <p>Loading users…</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <label key={user._id} className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                    className="mt-1 h-4 w-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email} | {user.phone}</p>
                    {user.leaveExtensionDays && user.leaveExtensionDays > 0 && (
                      <p className="text-xs text-green-600 font-medium">Already extended by {user.leaveExtensionDays} days</p>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <p>No approved users found.</p>
            )}
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <button
            onClick={applyExtension}
            className="w-full rounded-full bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-green-700"
          >
            Extend Payment Dates for {selectedUsers.length} User{selectedUsers.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </DashboardShell>
  );
}
