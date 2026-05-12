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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
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
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Recorded classes</h2>
            <p className="mt-2 text-sm text-gray-600">These are the class links added by the admin.</p>
          </div>
          <div className="space-y-4">
            {classes.length ? (
              classes.map((item) => (
                <div key={item._id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                  <a href={item.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-indigo-600 hover:text-indigo-900">
                    Watch class
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No recorded classes are available yet.</p>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
