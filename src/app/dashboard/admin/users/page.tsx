'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  approved: boolean;
  yogaPlan?: number;
  feesPaid?: string;
  platform?: string;
  dateOfJoining?: string;
  goals?: string[];
  goalOther?: string;
  medicalHistory?: string[];
  medicalHistoryOther?: string;
  dob?: string;
  membershipNumber?: string;
  newToYoga?: boolean;
  consent?: boolean;
  recordingVisible?: boolean;
  paymentDueDate?: string;
  leaveExtensionDays?: number;
}

export default function UserReviewPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const editableFieldClass = 'block w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none';

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    const joiningDate = user.dateOfJoining
      ? new Date(user.dateOfJoining).toLocaleDateString().toLowerCase()
      : '';

    const searchableText = [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.yogaPlan ? `${user.yogaPlan}` : '',
      user.feesPaid || '',
      user.platform || '',
      joiningDate,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

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

  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setEditData({
      ...user,
      dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : '',
      dateOfJoining: user.dateOfJoining ? new Date(user.dateOfJoining).toISOString().slice(0, 10) : '',
      paymentDueDate: (user as any).paymentDueDate
        ? new Date((user as any).paymentDueDate).toISOString().slice(0, 10)
        : '',
      goalsText: user.goals?.join(', ') || '',
      medicalHistoryText: user.medicalHistory?.join(', ') || '',
      newToYoga: typeof user.newToYoga === 'boolean' ? user.newToYoga : false,
      consent: Boolean(user.consent),
      leaveExtensionDays: (user as any).leaveExtensionDays || 0,
    });
  };

  const handleSave = async () => {
    try {
      const updates = {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        role: editData.role,
        approved: Boolean(editData.approved),
        dob: editData.dob || undefined,
        dateOfJoining: editData.dateOfJoining || undefined,
        yogaPlan: editData.yogaPlan ? Number(editData.yogaPlan) : undefined,
        feesPaid: editData.feesPaid || undefined,
        platform: editData.platform || undefined,
        membershipNumber: editData.membershipNumber || 'NA',
        goals: (editData.goalsText || '')
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean),
        goalOther: editData.goalOther || '',
        medicalHistory: (editData.medicalHistoryText || '')
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean),
        medicalHistoryOther: editData.medicalHistoryOther || '',
        newToYoga: Boolean(editData.newToYoga),
        consent: Boolean(editData.consent),
        paymentDueDate: editData.paymentDueDate || undefined,
        recordingVisible: Boolean(editData.recordingVisible),
        leaveExtensionDays: Number(editData.leaveExtensionDays || 0),
      };

      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingId,
          updates,
        }),
      });

      if (res.ok) {
        const { user } = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === editingId ? { ...u, ...user } : u))
        );
        setSelectedUser((prev) =>
          prev && prev._id === editingId ? { ...prev, ...user } : prev
        );
        setEditData({
          ...user,
          dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : '',
          dateOfJoining: user.dateOfJoining ? new Date(user.dateOfJoining).toISOString().slice(0, 10) : '',
          paymentDueDate: user.paymentDueDate
            ? new Date(user.paymentDueDate).toISOString().slice(0, 10)
            : '',
          goalsText: user.goals?.join(', ') || '',
          medicalHistoryText: user.medicalHistory?.join(', ') || '',
          newToYoga: typeof user.newToYoga === 'boolean' ? user.newToYoga : false,
          consent: Boolean(user.consent),
          leaveExtensionDays: user.leaveExtensionDays || 0,
        });
        setMessage('User updated successfully');
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Error updating user');
    }
  };

  const toggleRecording = async (userId: string, currentState: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          updates: { recordingVisible: !currentState },
        }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, recordingVisible: !currentState } : u
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">User Management</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">All Users - Review & Edit Enrollment</h2>
        </div>

        {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">Filter users (name, email, phone, role, joining date)</label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to filter by any field"
            className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none"
          />
          <p className="mt-2 text-xs text-slate-500">Showing {filteredUsers.length} of {users.length} users</p>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-5">Loading users…</p>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Phone Number</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Joining Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Approval Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 text-slate-700">{user.email}</td>
                      <td className="px-4 py-3 text-slate-700">{user.phone}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            handleEdit(user);
                            setSelectedUser(user);
                          }}
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-5">No users found.</p>
          )}
        </div>

        {selectedUser && (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">User Details</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{selectedUser.name}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setEditingId(null);
                }}
                className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300"
              >
                Close
              </button>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Name"
                    />
                    <input
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Email"
                    />
                    <input
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Phone"
                    />
                    <select
                      value={editData.role || 'user'}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className={editableFieldClass}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <label className="flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900">
                      <input
                        type="checkbox"
                        checked={Boolean(editData.approved)}
                        onChange={(e) => setEditData({ ...editData, approved: e.target.checked })}
                        className="h-4 w-4"
                      />
                      Approved
                    </label>
                    <label className="flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900">
                      <input
                        type="checkbox"
                        checked={Boolean(editData.recordingVisible)}
                        onChange={(e) => setEditData({ ...editData, recordingVisible: e.target.checked })}
                        className="h-4 w-4"
                      />
                      Show recordings
                    </label>
                    <label className="flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900">
                      <input
                        type="checkbox"
                        checked={Boolean(editData.newToYoga)}
                        onChange={(e) => setEditData({ ...editData, newToYoga: e.target.checked })}
                        className="h-4 w-4"
                      />
                      New to Yoga
                    </label>
                    <label className="flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900">
                      <input
                        type="checkbox"
                        checked={Boolean(editData.consent)}
                        onChange={(e) => setEditData({ ...editData, consent: e.target.checked })}
                        className="h-4 w-4"
                      />
                      Consent Accepted
                    </label>
                    <input
                      type="date"
                      value={editData.dob || ''}
                      onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                      className={editableFieldClass}
                      placeholder="DOB"
                    />
                    <input
                      type="date"
                      value={editData.dateOfJoining || ''}
                      onChange={(e) => setEditData({ ...editData, dateOfJoining: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Joining Date"
                    />
                    <select
                      value={editData.yogaPlan || ''}
                      onChange={(e) => setEditData({ ...editData, yogaPlan: e.target.value ? Number(e.target.value) : '' })}
                      className={editableFieldClass}
                    >
                      <option value="">Yoga Plan</option>
                      <option value={1}>1 month</option>
                      <option value={3}>3 months</option>
                      <option value={6}>6 months</option>
                      <option value={12}>12 months</option>
                    </select>
                    <select
                      value={editData.feesPaid || ''}
                      onChange={(e) => setEditData({ ...editData, feesPaid: e.target.value })}
                      className={editableFieldClass}
                    >
                      <option value="">Fees Paid</option>
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                    </select>
                    <select
                      value={editData.platform || ''}
                      onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                      className={editableFieldClass}
                    >
                      <option value="">Platform</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                    <input
                      value={editData.membershipNumber || ''}
                      onChange={(e) => setEditData({ ...editData, membershipNumber: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Membership Number"
                    />
                    <input
                      type="date"
                      value={editData.paymentDueDate || ''}
                      onChange={(e) => setEditData({ ...editData, paymentDueDate: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Payment Due Date"
                    />
                    <input
                      type="number"
                      value={editData.leaveExtensionDays ?? 0}
                      onChange={(e) => setEditData({ ...editData, leaveExtensionDays: Number(e.target.value) })}
                      className={editableFieldClass}
                      placeholder="Leave Extension Days"
                    />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={editData.goalsText || ''}
                      onChange={(e) => setEditData({ ...editData, goalsText: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Goals (comma separated)"
                    />
                    <input
                      value={editData.goalOther || ''}
                      onChange={(e) => setEditData({ ...editData, goalOther: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Other Goal"
                    />
                    <input
                      value={editData.medicalHistoryText || ''}
                      onChange={(e) => setEditData({ ...editData, medicalHistoryText: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Medical History (comma separated)"
                    />
                    <input
                      value={editData.medicalHistoryOther || ''}
                      onChange={(e) => setEditData({ ...editData, medicalHistoryOther: e.target.value })}
                      className={editableFieldClass}
                      placeholder="Other Medical History"
                    />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => handleEdit(selectedUser)}
                    className="rounded-full bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-400"
                  >
                    Reset
                  </button>
                  <button
                    onClick={async () => {
                      await toggleRecording(selectedUser._id, selectedUser.recordingVisible !== false);
                      setSelectedUser((prev) =>
                        prev ? { ...prev, recordingVisible: !(prev.recordingVisible !== false) } : prev
                      );
                      setEditData((prev: any) => ({ ...prev, recordingVisible: !(prev.recordingVisible !== false) }));
                    }}
                    className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    {Boolean(editData.recordingVisible) ? 'Hide' : 'Show'} Recordings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
