import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const primaryEmail = user.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'sent';

    let analyticsData;

    if (type === 'sent') {
      const totalSeranotes = await prisma.seranote.count({
        where: { senderEmail: primaryEmail },
      });
      
      // Count total messages received in response to sent notes
      const totalMessages = await prisma.message.count({
        where: {
          seranote: {
            senderEmail: primaryEmail,
          },
          senderEmail: {
            not: primaryEmail, // Don't count own messages
          },
        },
      });

      // Count unique recipients
      const uniqueRecipients = await prisma.seranote.findMany({
        where: { senderEmail: primaryEmail },
        select: { receiverEmail: true },
        distinct: ['receiverEmail'],
      });

      analyticsData = {
        totalSeranotes,
        totalMessages,
        uniqueRecipients: uniqueRecipients.length,
      };
    } else {
      // For received notes analytics
      const totalNotes = await prisma.seranote.count({
        where: { receiverEmail: primaryEmail },
      });
      
      // Count total messages in received notes
      const totalMessages = await prisma.message.count({
        where: {
          seranote: {
            receiverEmail: primaryEmail,
          },
        },
      });

      // Count unique senders
      const uniqueSenders = await prisma.seranote.findMany({
        where: { receiverEmail: primaryEmail },
        select: { senderEmail: true },
        distinct: ['senderEmail'],
      });

      analyticsData = {
        totalNotes,
        totalMessages,
        uniqueSenders: uniqueSenders.length,
      };
    }

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
