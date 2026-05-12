import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsedDays = parseInt(searchParams.get('days') || '7', 10);
    const days = Number.isNaN(parsedDays) || parsedDays <= 0 ? 7 : parsedDays;

    await dbConnect();

    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    // Fetch all approved users, then filter in JS so leaveExtensionDays is respected.
    // Effective due date = paymentDueDate + leaveExtensionDays days.
    const allApproved = await User.find({ approved: true })
      .select('-password -resetToken -resetTokenExpiry')
      .sort({ paymentDueDate: 1, createdAt: 1 });

    const users =
      days >= 30
        ? allApproved
        : allApproved.filter((u) => {
            if (!u.paymentDueDate) return false;
            const extension = (u.leaveExtensionDays ?? 0) * MS_PER_DAY;
            const effectiveDue = new Date(u.paymentDueDate.getTime() + extension);
            return effectiveDue <= futureDate;
          });

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
