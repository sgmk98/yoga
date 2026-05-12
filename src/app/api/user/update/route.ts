import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      dob,
      dateOfJoining,
      yogaPlan,
      feesPaid,
      platform,
      membershipNumber,
      goals,
      goalOther,
      medicalHistory,
      medicalHistoryOther,
      newToYoga,
      consent,
    } = await request.json();

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.dob = dob ? new Date(dob) : user.dob;
    user.dateOfJoining = dateOfJoining ? new Date(dateOfJoining) : user.dateOfJoining;
    user.yogaPlan = yogaPlan || user.yogaPlan;
    user.feesPaid = feesPaid || user.feesPaid;
    user.platform = platform || user.platform;
    user.membershipNumber = membershipNumber || user.membershipNumber || 'NA';
    user.goals = Array.isArray(goals) ? goals : user.goals;
    user.goalOther = goalOther || user.goalOther;
    user.medicalHistory = Array.isArray(medicalHistory) ? medicalHistory : user.medicalHistory;
    user.medicalHistoryOther = medicalHistoryOther || user.medicalHistoryOther;
    user.newToYoga = typeof newToYoga === 'boolean' ? newToYoga : user.newToYoga;
    user.consent = typeof consent === 'boolean' ? consent : user.consent;

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}