import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const primaryEmail = user.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const { id } = await params;

    // Check if user has access to this seranote
    const seranote = await prisma.seranote.findFirst({
      where: { 
        id: id,
        OR: [
          { senderEmail: primaryEmail },
          { receiverEmail: primaryEmail }
        ]
      },
    });

    if (!seranote) {
      return NextResponse.json({ error: 'Seranote not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { seranoteId: id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const primaryEmail = user.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const { id } = await params;
    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Check if user has access to this seranote
    const seranote = await prisma.seranote.findFirst({
      where: { 
        id: id,
        OR: [
          { senderEmail: primaryEmail },
          { receiverEmail: primaryEmail }
        ]
      },
    });

    if (!seranote) {
      return NextResponse.json({ error: 'Seranote not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        seranoteId: id,
        senderEmail: primaryEmail,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
