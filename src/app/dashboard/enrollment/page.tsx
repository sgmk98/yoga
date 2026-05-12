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
  membershipNumber?: string;
  goals?: string[];
  goalOther?: string;
  medicalHistory?: string[];
  medicalHistoryOther?: string;
  newToYoga?: boolean;
  consent?: boolean;
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
          membershipNumber: data.membershipNumber || 'NA',
          goals: data.goals || [],
          goalOther: data.goalOther || '',
          medicalHistory: data.medicalHistory || [],
          medicalHistoryOther: data.medicalHistoryOther || '',
          newToYoga: typeof data.newToYoga === 'boolean' ? data.newToYoga : false,
          consent: data.consent || false,
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

    if (!profile.membershipNumber?.trim()) {
      setError('Please enter your NGV membership number or NA.');
      return;
    }
    if (!(profile.goals?.length) && !profile.goalOther?.trim()) {
      setError('Please select at least one goal or enter another goal.');
      return;
    }
    if (!(profile.medicalHistory?.length)) {
      setError('Please select any relevant medical history or None.');
      return;
    }
    if (typeof profile.newToYoga !== 'boolean') {
      setError('Please let us know if you are new to yoga.');
      return;
    }
    if (!profile.consent) {
      setError('Please agree to the consent statement before submitting.');
      return;
    }

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dob: profile.dob,
        dateOfJoining: profile.dateOfJoining,
        yogaPlan: profile.yogaPlan,
        feesPaid: profile.feesPaid,
        platform: profile.platform,
        membershipNumber: profile.membershipNumber,
        goals: profile.goals,
        goalOther: profile.goalOther,
        medicalHistory: profile.medicalHistory,
        medicalHistoryOther: profile.medicalHistoryOther,
        newToYoga: profile.newToYoga,
        consent: profile.consent,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message || 'Enrollment details saved.');
    } else {
      setError(data.error || 'Unable to save enrollment details.');
    }
  };

  const updateField = (key: keyof UserProfile, value: string | number | boolean | undefined) => {
    setProfile((current) => (current ? { ...current, [key]: value } : current));
  };

  const toggleGoal = (goal: string) => {
    setProfile((current) => {
      if (!current) return current;
      const goals = current.goals || [];
      const updated = goals.includes(goal) ? goals.filter((item) => item !== goal) : [...goals, goal];
      return { ...current, goals: updated };
    });
  };

  const toggleMedicalHistory = (entry: string) => {
    setProfile((current) => {
      if (!current) return current;
      let medicalHistory = current.medicalHistory || [];
      if (entry === 'None') {
        medicalHistory = ['None'];
      } else {
        medicalHistory = medicalHistory.includes('None') ? [] : medicalHistory;
        medicalHistory = medicalHistory.includes(entry)
          ? medicalHistory.filter((item) => item !== entry)
          : [...medicalHistory, entry];
      }
      return { ...current, medicalHistory };
    });
  };

  return (
    <DashboardShell>
      {loading ? (
        <p>Loading enrollment form…</p>
      ) : profile ? (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Enrollment</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Update your membership</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Complete your profile details so admins can approve your membership and unlock full access.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { label: 'Name', value: profile.name },
                { label: 'Email', value: profile.email },
                { label: 'Phone', value: profile.phone },
              ].map((field) => (
                <div key={field.label} className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{field.label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-sm font-medium text-slate-700">Date of birth</span>
                <input
                  id="dob"
                  type="date"
                  value={profile.dob || ''}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className="block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="space-y-2 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-sm font-medium text-slate-700">Date of joining</span>
                <input
                  id="dateOfJoining"
                  type="date"
                  value={profile.dateOfJoining || ''}
                  onChange={(e) => updateField('dateOfJoining', e.target.value)}
                  className="block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <label htmlFor="membershipNumber" className="block text-sm font-medium text-slate-700">
                NGV club membership number
              </label>
              <input
                id="membershipNumber"
                value={profile.membershipNumber || ''}
                onChange={(e) => updateField('membershipNumber', e.target.value)}
                placeholder="Enter your membership number or NA"
                className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Goal of joining Yoga class</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {[
                  'Weight loss',
                  'Overall fitness',
                  'Flexibility',
                  'Stress management',
                  'Mental peace',
                  'Gain strength',
                  'Learn advance postures',
                ].map((goal) => (
                  <label key={goal} className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition hover:border-indigo-300">
                    <input
                      type="checkbox"
                      checked={profile.goals?.includes(goal) || false}
                      onChange={() => toggleGoal(goal)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    {goal}
                  </label>
                ))}
              </div>
              <label className="mt-4 block text-sm font-medium text-slate-700">
                Is any other - please inform instructor
              </label>
              <input
                value={profile.goalOther || ''}
                onChange={(e) => updateField('goalOther', e.target.value)}
                className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Any medical history you wanted to pre inform me</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  'None',
                  'Knee pain',
                  'Back pain',
                  'B P',
                  'Diabetes',
                  'Spondylitis',
                  'Disk bulge',
                  'Acidity',
                  'Thyroid',
                  'PCOS/PCOD',
                  'Insomnia (trouble sleeping)',
                ].map((condition) => (
                  <label key={condition} className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition hover:border-indigo-300">
                    <input
                      type="checkbox"
                      checked={profile.medicalHistory?.includes(condition) || false}
                      onChange={() => toggleMedicalHistory(condition)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    {condition}
                  </label>
                ))}
              </div>
              <label className="mt-4 block text-sm font-medium text-slate-700">
                Is any other - please inform instructor
              </label>
              <input
                value={profile.medicalHistoryOther || ''}
                onChange={(e) => updateField('medicalHistoryOther', e.target.value)}
                className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Are you new to Yoga?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition hover:border-indigo-300">
                    <input
                      type="radio"
                      name="newToYoga"
                      value={option}
                      checked={profile.newToYoga === (option === 'Yes')}
                      onChange={() => updateField('newToYoga', option === 'Yes')}
                      className="h-4 w-4 text-indigo-600"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={profile.consent || false}
                  onChange={(e) => updateField('consent', e.target.checked)}
                  className="mt-1 h-4 w-4 text-indigo-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  I affirm that I alone am responsible to decide whether to practice yoga & it exposes me to a possible risk of personal injury. I am fully aware of this risk and hereby release the teachers, the management, and the institution from any and all liability, negligence or other claims arising from or in any way connected to with my participation in yoga.
                </span>
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600 shadow-sm">
              <p>
                Note:- We remain closed on all government and public holidays.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Yoga plan</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                {[1, 3, 6, 12].map((plan) => (
                  <label key={plan} className="flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-300">
                    <input
                      type="radio"
                      name="yogaPlan"
                      value={plan}
                      checked={profile.yogaPlan === plan}
                      onChange={() => updateField('yogaPlan', plan)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="text-sm text-slate-900">{plan} month{plan > 1 ? 's' : ''}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-700">Fees paid</p>
                <div className="mt-3 grid gap-3">
                  {['cash', 'online'].map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-300">
                      <input
                        type="radio"
                        name="feesPaid"
                        value={option}
                        checked={profile.feesPaid === option}
                        onChange={() => updateField('feesPaid', option)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span className="capitalize text-sm text-slate-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-700">Platform</p>
                <div className="mt-3 grid gap-3">
                  {['online', 'offline'].map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-300">
                      <input
                        type="radio"
                        name="platform"
                        value={option}
                        checked={profile.platform === option}
                        onChange={() => updateField('platform', option)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span className="capitalize text-sm text-slate-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-700"
            >
              Save enrollment details
            </button>
          </form>
        </div>
      ) : (
        <p>Unable to load enrollment data.</p>
      )}
    </DashboardShell>
  );
}
