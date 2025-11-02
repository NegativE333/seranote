import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const primaryEmail = user.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    // Await params in Next.js 15
    const { id } = await params;

    // First fetch the seranote without filtering by email
    const seranote = await prisma.seranote.findUnique({
      where: { id: id },
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

    // Check if user is sender or receiver
    const isSender = seranote.senderEmail === primaryEmail;
    const isReceiver = seranote.receiverEmail === primaryEmail;

    // If user is neither sender nor receiver, check if we should auto-assign as receiver
    if (!isSender && !isReceiver) {
      // If receiverEmail is null and user is not the sender, set user as receiver
      if (!seranote.receiverEmail) {
        await prisma.seranote.update({
          where: { id: id },
          data: { receiverEmail: primaryEmail },
        });
        // Refetch the seranote with all includes after update
        const updatedSeranote = await prisma.seranote.findUnique({
          where: { id: id },
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
        return NextResponse.json(updatedSeranote);
      } else {
        // User is not sender, receiver is set to someone else, deny access
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    return NextResponse.json(seranote);
  } catch (error) {
    console.error('Error fetching seranote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const primaryEmail = user.emailAddresses[0]?.emailAddress;
    if (!primaryEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    // Await params in Next.js 15
    const { id } = await params;

    // First verify the user owns this seranote
    const seranote = await prisma.seranote.findFirst({
      where: {
        id: id,
        OR: [{ senderEmail: primaryEmail }, { receiverEmail: primaryEmail }],
      },
    });

    if (!seranote) {
      return NextResponse.json({ error: 'Seranote not found or access denied' }, { status: 404 });
    }

    // Delete related records first (due to foreign key constraints)
    await prisma.userSeranoteRead.deleteMany({
      where: { seranoteId: id },
    });

    await prisma.reaction.deleteMany({
      where: { seranoteId: id },
    });

    await prisma.message.deleteMany({
      where: { seranoteId: id },
    });

    // Finally delete the seranote
    await prisma.seranote.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: 'Seranote deleted successfully' });
  } catch (error) {
    console.error('Error deleting seranote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
