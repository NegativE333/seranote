import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get user details from Clerk
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Ensure user exists in database
    const primaryEmail = user.emailAddresses[0]?.emailAddress;
    if (primaryEmail) {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: primaryEmail,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName,
        },
        create: {
          id: userId,
          email: primaryEmail,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName,
        },
      });
    }

    const body = await req.json();
    const {
      title,
      message,
      songId,
      songClipStart,
      songClipDur,
      songTotalDur,
      receiverId,
    } = body || {};

    if (!title || !message || !songId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const seranote = await prisma.seranote.create({
      data: {
        title,
        message,
        songId,
        songClipStart: songClipStart || 0,
        songClipDur: songClipDur || 114,
        songTotalDur: songTotalDur || null,
        senderId: userId,
        receiverId: receiverId || null,
      },
    });

    return NextResponse.json(seranote);
  } catch (error) {
    console.error('Error creating seranote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}