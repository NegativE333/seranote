import { prisma } from '@/lib/prisma';
import { UserJSON } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id, email_addresses, first_name, last_name } = evt.data as UserJSON;
    const eventType = evt.type;
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const primaryEmail = email_addresses?.[0]?.email_address;

      if (primaryEmail) {
        await prisma.user.upsert({
          where: { id },
          update: {
            email: primaryEmail,
            name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name,
          },
          create: {
            id,
            email: primaryEmail,
            name: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name,
          },
        });
      }
    }

    if (eventType === 'user.deleted') {
      if (id) {
        console.log(id);
        await prisma.user.delete({
          where: { id },
        });
      }
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
