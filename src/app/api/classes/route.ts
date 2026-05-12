import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Class from '@/models/Class';
import User from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    if (session.user.role !== 'admin') {
      const currentUser = await User.findById(session.user.id).select('approved recordingVisible');
      if (!currentUser || !currentUser.approved || currentUser.recordingVisible === false) {
        return NextResponse.json([]);
      }
    }

    const classes = await Class.find().populate('addedBy', 'name');
    return NextResponse.json(classes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, link } = await request.json();

    if (!title || !description || !link) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await dbConnect();

    const newClass = new Class({
      title,
      description,
      link,
      addedBy: session.user.id,
    });

    await newClass.save();

    return NextResponse.json({ message: 'Class added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { classId, title, description, link } = await request.json();

    if (!classId || !title || !description || !link) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await dbConnect();

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { title, description, link },
      { new: true }
    );

    if (!updatedClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Class updated successfully', class: updatedClass });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}