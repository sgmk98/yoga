import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Class from '@/models/Class';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
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