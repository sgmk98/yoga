import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userIds, extensionDays } = await request.json();

    if (!Array.isArray(userIds) || !extensionDays || extensionDays <= 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await dbConnect();

    const updateResult = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $inc: { leaveExtensionDays: extensionDays },
      }
    );

    return NextResponse.json({
      message: 'Leave extension applied',
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
