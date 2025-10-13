'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import NotificationBanner from '@/components/NotificationBanner';
import PaymentsList from '@/components/PaymentsList';
import PayoutsList from '@/components/PayoutsList';

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeStripeConnect() {
      try {
        // Fetch account data
        const accountResponse = await fetch('/api/accounts');
        if (!accountResponse.ok) {
          throw new Error('Failed to fetch account data');
        }
        const accounts = await accountResponse.json();
        const account = accounts.find((acc: any) => acc.id === accountId);

        if (!account) {
          throw new Error('Account not found');
        }

        setAccountData(account);

        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
          throw new Error('Stripe publishable key is not configured');
        }

        const instance = loadConnectAndInitialize({
          publishableKey,
          fetchClientSecret: async () => {
            const response = await fetch('/api/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ accountId }),
            });

            if (!response.ok) {
              throw new Error('Failed to create account session');
            }

            const { clientSecret } = await response.json();
            return clientSecret;
          },
        });

        setStripeConnectInstance(instance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    initializeStripeConnect();
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button
          onClick={() => router.push('/')}
          className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
        >
          ← Back to Accounts
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition-colors"
      >
        <span className="text-xl">←</span> Back to Accounts
      </button>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Account Details</h2>
        <p className="text-gray-600 mt-2 font-mono">{accountId}</p>
      </div>

      <div className="space-y-6">
        <NotificationBanner
          stripeConnectInstance={stripeConnectInstance}
          detailsSubmitted={accountData?.details_submitted ?? true}
        />
        <PaymentsList stripeConnectInstance={stripeConnectInstance} />
        <PayoutsList stripeConnectInstance={stripeConnectInstance} />
      </div>
    </div>
  );
}
