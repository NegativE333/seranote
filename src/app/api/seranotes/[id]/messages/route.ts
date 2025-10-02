import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import pusher from '@/lib/pusher';

async function getUnreadCount(seranoteId: string, userEmail: string) {
  // Get the last read timestamp for this user and seranote
  const readStatus = await prisma.userSeranoteRead.findUnique({
    where: {
      userEmail_seranoteId: {
        userEmail,
        seranoteId,
      },
    },
  });

  const lastReadAt = readStatus?.lastReadAt || new Date(0);

  // Count unread messages
  const unreadCount = await prisma.message.count({
    where: {
      seranoteId,
      createdAt: {
        gt: lastReadAt,
      },
      senderEmail: {
        not: userEmail, // Don't count own messages
      },
    },
  });

  return unreadCount;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
        OR: [{ senderEmail: primaryEmail }, { receiverEmail: primaryEmail }],
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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
        OR: [{ senderEmail: primaryEmail }, { receiverEmail: primaryEmail }],
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

    // Trigger Pusher event for real-time updates
    await pusher.trigger(`seranote-${id}`, 'new-message', {
      message,
      unreadCount: await getUnreadCount(id, primaryEmail),
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
        OR: [{ senderEmail: primaryEmail }, { receiverEmail: primaryEmail }],
      },
    });

    if (!seranote) {
      return NextResponse.json({ error: 'Seranote not found' }, { status: 404 });
    }

    // Update or create read status
    await prisma.userSeranoteRead.upsert({
      where: {
        userEmail_seranoteId: {
          userEmail: primaryEmail,
          seranoteId: id,
        },
      },
      update: {
        lastReadAt: new Date(),
      },
      create: {
        userEmail: primaryEmail,
        seranoteId: id,
        lastReadAt: new Date(),
      },
    });

    // Mark all messages as read
    await prisma.message.updateMany({
      where: {
        seranoteId: id,
        senderEmail: {
          not: primaryEmail, // Don't mark own messages as read
        },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Trigger Pusher event for read status update
    await pusher.trigger(`seranote-${id}`, 'messages-read', {
      userEmail: primaryEmail,
      unreadCount: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
