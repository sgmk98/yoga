'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  dateOfJoining?: string;
  yogaPlan?: number;
  feesPaid?: string;
  platform?: string;
  membershipNumber?: string;
  goals?: string[];
  goalOther?: string;
  medicalHistory?: string[];
  medicalHistoryOther?: string;
  newToYoga?: boolean;
  consent?: boolean;
  approved?: boolean;
}

interface ClassItem {
  _id: string;
  title: string;
  description: string;
  link: string;
}

export default function AdminPage() {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [selectedPendingUser, setSelectedPendingUser] = useState<PendingUser | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLink, setEditLink] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      const [pendingRes, classesRes] = await Promise.all([
        fetch('/api/admin/pending'),
        fetch('/api/classes'),
      ]);

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPending(data);
      }

      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(data);
      }
    }
    loadData();
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
      const classesRes = await fetch('/api/classes');
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData);
      }
    } else {
      setError(data.error || 'Unable to add class');
    }
  };

  const startEditClass = (classItem: ClassItem) => {
    setEditingClassId(classItem._id);
    setEditTitle(classItem.title);
    setEditDescription(classItem.description);
    setEditLink(classItem.link);
    setMessage('');
    setError('');
  };

  const cancelEditClass = () => {
    setEditingClassId(null);
    setEditTitle('');
    setEditDescription('');
    setEditLink('');
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!editingClassId) {
      setError('No class selected for editing');
      return;
    }

    const res = await fetch('/api/classes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: editingClassId,
        title: editTitle,
        description: editDescription,
        link: editLink,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Class updated successfully');
      setClasses((prev) =>
        prev.map((item) =>
          item._id === editingClassId
            ? {
                ...item,
                title: editTitle,
                description: editDescription,
                link: editLink,
              }
            : item
        )
      );
      cancelEditClass();
    } else {
      setError(data.error || 'Unable to update class');
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Admin control</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Manage the studio</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Review pending profiles, publish new recorded classes, and manage payments.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <a href="/dashboard/admin/users" className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">Management</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">All Users & Enrollment</p>
          </a>
          <a href="/dashboard/admin/payment-due" className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-600">Finance</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Payment Due</p>
          </a>
          <a href="/dashboard/admin/leave-extension" className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-green-600">Leaves</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Extend Dates</p>
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Pending profile approvals</h3>
            <div className="mt-4 space-y-4">
              {pending.length ? (
                pending.map((user) => (
                  <div key={user._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                    <p className="text-sm text-slate-600">{user.phone}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedPendingUser(user)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleApprove(user._id, true)}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(user._id, false)}
                        className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">No pending profiles to review.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Add recorded class link</h3>
            <form onSubmit={handleAddClass} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Link</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
              {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
              <button className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-700">
                Add class link
              </button>
            </form>
          </div>
        </div>

        {selectedPendingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8">
            <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">Pending Enrollment</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">{selectedPendingUser.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">Review full client details before approval.</p>
                </div>
                <button
                  onClick={() => setSelectedPendingUser(null)}
                  className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Email</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.email || 'N/A'}</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Phone</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.phone || 'N/A'}</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Date of Birth</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.dob ? new Date(selectedPendingUser.dob).toLocaleDateString() : 'N/A'}</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Joining Date</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.dateOfJoining ? new Date(selectedPendingUser.dateOfJoining).toLocaleDateString() : 'N/A'}</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Yoga Plan</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.yogaPlan ? `${selectedPendingUser.yogaPlan} month(s)` : 'N/A'}</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Fees Paid</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.feesPaid || 'N/A'}</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Platform</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.platform || 'N/A'}</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Membership Number</p><p className="mt-1 text-sm text-slate-900">{selectedPendingUser.membershipNumber || 'NA'}</p></div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Goals</p>
                  <p className="mt-1 text-sm text-slate-900">{selectedPendingUser.goals && selectedPendingUser.goals.length > 0 ? selectedPendingUser.goals.join(', ') : 'N/A'}</p>
                  {selectedPendingUser.goalOther && <p className="mt-1 text-xs text-slate-600">Other: {selectedPendingUser.goalOther}</p>}
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Medical History</p>
                  <p className="mt-1 text-sm text-slate-900">{selectedPendingUser.medicalHistory && selectedPendingUser.medicalHistory.length > 0 ? selectedPendingUser.medicalHistory.join(', ') : 'N/A'}</p>
                  {selectedPendingUser.medicalHistoryOther && <p className="mt-1 text-xs text-slate-600">Other: {selectedPendingUser.medicalHistoryOther}</p>}
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">New to Yoga</p>
                  <p className="mt-1 text-sm text-slate-900">{typeof selectedPendingUser.newToYoga === 'boolean' ? (selectedPendingUser.newToYoga ? 'Yes' : 'No') : 'N/A'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Consent</p>
                  <p className="mt-1 text-sm text-slate-900">{selectedPendingUser.consent ? 'Accepted' : 'Not accepted'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    handleApprove(selectedPendingUser._id, true);
                    setSelectedPendingUser(null);
                  }}
                  className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Approve User
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedPendingUser._id, false);
                    setSelectedPendingUser(null);
                  }}
                  className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Reject User
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Edit recorded class links</h3>
          <div className="mt-4 space-y-4">
            {classes.length === 0 ? (
              <p className="text-sm text-slate-600">No classes available to edit.</p>
            ) : (
              classes.map((classItem) => (
                <div key={classItem._id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  {editingClassId === classItem._id ? (
                    <form onSubmit={handleUpdateClass} className="space-y-3">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                        placeholder="Title"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                        placeholder="Description"
                      />
                      <input
                        value={editLink}
                        onChange={(e) => setEditLink(e.target.value)}
                        className="block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                        placeholder="Class link"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditClass}
                          className="rounded-full bg-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{classItem.title}</p>
                        <p className="text-sm text-slate-600">{classItem.description}</p>
                        <p className="mt-1 text-xs text-indigo-700 break-all">{classItem.link}</p>
                      </div>
                      <button
                        onClick={() => startEditClass(classItem)}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

