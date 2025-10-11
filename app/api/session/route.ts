import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        notification_banner: { enabled: true },
        payments: { enabled: true, features: { refund_management: true } },
        payouts: { enabled: true },
      },
    });

    return NextResponse.json({ clientSecret: accountSession.client_secret });
  } catch (error) {
    console.error('Error creating account session:', error);
    return NextResponse.json(
      { error: 'Failed to create account session' },
      { status: 500 }
    );
  }
}
