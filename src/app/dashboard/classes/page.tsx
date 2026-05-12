'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

interface ClassItem {
  _id: string;
  title: string;
  description: string;
  link: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      const [classesRes, profileRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/user/me'),
      ]);

      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData);
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setApproved(Boolean(profileData.approved));
      }

      setLoading(false);
    }
    loadClasses();
  }, []);

  return (
    <DashboardShell>
      {loading ? (
        <p>Loading classes…</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Recorded classes</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Practice on your schedule</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Access the latest video sessions shared by your studio admin.
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {classes.length ? (
              classes.map((item) => (
                <div key={item._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                    <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                      Watch class
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-600">
                  {approved === false
                    ? 'Your profile is pending admin approval. Recorded class links will be visible after approval.'
                    : 'No recorded classes are available yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
