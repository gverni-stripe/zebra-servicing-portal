import { NextRequest, NextResponse } from 'next/server';

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

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured' },
        { status: 500 }
      );
    }

    // Trigger the merchant issue using Stripe test helper API
    const formData = new URLSearchParams();
    formData.append('issue_type', 'additional_info');
    formData.append('account', accountId);

    const response = await fetch('https://api.stripe.com/v1/test_helpers/demo/merchant_issue', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Stripe API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to trigger merchant issue' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error triggering merchant issue:', error);
    return NextResponse.json(
      { error: 'Failed to trigger merchant issue' },
      { status: 500 }
    );
  }
}
