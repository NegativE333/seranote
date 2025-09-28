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

    // Await params in Next.js 15
    const { id } = await params;

    const seranote = await prisma.seranote.findFirst({
      where: { 
        id: id,
        OR: [
          { senderEmail: primaryEmail },
          { receiverEmail: primaryEmail }
        ]
      },
      include: {
        messages: {
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
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!seranote) {
      return NextResponse.json({ error: 'Seranote not found' }, { status: 404 });
    }

    return NextResponse.json(seranote);
  } catch (error) {
    console.error('Error fetching seranote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}