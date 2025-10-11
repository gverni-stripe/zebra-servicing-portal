'use client';

import Link from 'next/link';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { ConnectedAccountData } from '@/types/stripe';

interface AccountCardProps {
  account: ConnectedAccountData;
}

export default function AccountCard({ account }: AccountCardProps) {
  const accountName = account.business_profile?.name || 'Unnamed Account';
  const currentlyDueEmpty = !account.requirements?.currently_due || account.requirements.currently_due.length === 0;
  const pastDueEmpty = !account.requirements?.past_due || account.requirements.past_due.length === 0;
  const [isTriggering, setIsTriggering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleTriggerIssue = async () => {
    setIsTriggering(true);
    setMessage(null);

    try {
      const response = await fetch('/api/trigger-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId: account.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger issue');
      }

      setMessage('✓ Merchant issue triggered successfully');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('✗ Failed to trigger issue');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{accountName}</h2>
        <p className="text-sm text-gray-500 font-mono">{account.id}</p>
      </div>

      <div className="space-y-2 mb-4">
        <StatusBadge
          label="Charges Enabled"
          status={account.charges_enabled}
          ariaLabel={account.charges_enabled ? "Charges enabled" : "Charges disabled"}
        />
        <StatusBadge
          label="Payouts Enabled"
          status={account.payouts_enabled}
          ariaLabel={account.payouts_enabled ? "Payouts enabled" : "Payouts disabled"}
        />
        <StatusBadge
          label="Details Submitted"
          status={account.details_submitted}
          ariaLabel={account.details_submitted ? "Details submitted" : "Details not submitted"}
        />
        <StatusBadge
          label="Currently Due"
          status={currentlyDueEmpty ? 'empty' : 'not-empty'}
          ariaLabel={currentlyDueEmpty ? "No requirements currently due" : "Requirements currently due"}
        />
        <StatusBadge
          label="Past Due"
          status={pastDueEmpty ? 'empty' : 'not-empty'}
          ariaLabel={pastDueEmpty ? "No requirements past due" : "Requirements past due"}
        />

        {account.requirements?.disabled_reason && (
          <div className="pt-2">
            <p className="text-sm text-red-600">
              <span className="font-medium">Disabled Reason:</span> {account.requirements.disabled_reason}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Link
          href={`/account/${account.id}`}
          className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
        >
          View Details
        </Link>

        <button
          onClick={handleTriggerIssue}
          disabled={isTriggering}
          className="w-full text-center bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTriggering ? 'Triggering...' : 'Trigger Merchant Issue'}
        </button>

        {message && (
          <p className={`text-sm text-center ${message.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
