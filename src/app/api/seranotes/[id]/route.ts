import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Await params in Next.js 15
    const { id } = await params;

    const seranote = await prisma.seranote.findFirst({
      where: { 
        id: id,
        senderId: userId // Only allow access to own seranotes
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