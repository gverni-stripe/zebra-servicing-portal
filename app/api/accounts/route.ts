import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    // Use auto-pagination to fetch all accounts
    const allAccounts = [];
    for await (const account of stripe.accounts.list({ limit: 100 })) {
      allAccounts.push(account);
    }

    return NextResponse.json(allAccounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connected accounts' },
      { status: 500 }
    );
  }
}
