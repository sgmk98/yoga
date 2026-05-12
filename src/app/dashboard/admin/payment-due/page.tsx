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
  yogaPlan?: number;
  leaveExtensionDays?: number;
}

export default function PaymentDuePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [customDays, setCustomDays] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchPaymentDue = async (days: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payment-due?days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setSelectedDays(days);
        setCustomDays('');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCustomFilter = () => {
    if (customDays && parseInt(customDays) > 0) {
      fetchPaymentDue(parseInt(customDays));
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const extendPaymentDates = async (days: number) => {
    if (selectedUsers.length === 0) {
      setMessage('Please select at least one user');
      return;
    }

    try {
      const res = await fetch('/api/admin/leave-extension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUsers, extensionDays: days }),
      });

      if (res.ok) {
        setMessage(`Payment dates extended by ${days} days for ${selectedUsers.length} users`);
        setSelectedUsers([]);
        await fetchPaymentDue(selectedDays);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPaymentDue(7);
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Payment Management</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Filter by Payment Due Date</h2>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {[7, 3, 1].map((days) => (
                <button
                  key={days}
                  onClick={() => fetchPaymentDue(days)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    selectedDays === days
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-900 hover:border-indigo-300'
                  }`}
                >
                  Due in {days} day{days > 1 ? 's' : ''}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                placeholder="Enter custom days"
                className="block flex-1 rounded-3xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleCustomFilter}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}

        {!loading && users.length > 0 && (
          <div className="rounded-[1.5rem] border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
            {selectedDays >= 30 ? (
              <>
                Showing <strong>{users.length} user(s)</strong> (all approved users)
              </>
            ) : (
              <>
                Showing <strong>{users.length} user(s)</strong> with payment due up to the next <strong>{selectedDays} days</strong> (including overdue)
              </>
            )}
          </div>
        )}

        {selectedUsers.length > 0 && (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              {selectedUsers.length} user(s) selected - Extend payment date by:
            </p>
            <div className="flex flex-wrap gap-2">
              {[1, 3, 7].map((days) => (
                <button
                  key={days}
                  onClick={() => extendPaymentDates(days)}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  +{days} day{days > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <p>Loading users…</p>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="flex items-start gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="mt-1 h-4 w-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-600">{user.email} | {user.phone}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Plan: {user.yogaPlan} month(s) | Joined: {user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A'}
                  </p>
                  {user.paymentDueDate && (
                    <p className="text-xs font-medium text-orange-600">
                      Due: {new Date(user.paymentDueDate).toLocaleDateString()}
                    </p>
                  )}
                  {user.leaveExtensionDays && user.leaveExtensionDays > 0 && (
                    <p className="text-xs text-green-600">Extended by {user.leaveExtensionDays} days</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">
              {selectedDays >= 30
                ? 'No approved users found.'
                : 'No users with payment due in this period (including overdue).'}
            </p>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
