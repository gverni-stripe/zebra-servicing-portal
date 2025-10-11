'use client';

import { useEffect, useRef } from 'react';

interface PayoutsListProps {
  stripeConnectInstance: any;
}

export default function PayoutsList({ stripeConnectInstance }: PayoutsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stripeConnectInstance || !containerRef.current) return;

    const payoutsList = stripeConnectInstance.create('payouts');

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(payoutsList);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [stripeConnectInstance]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payouts</h3>
      <div ref={containerRef} className="min-h-[300px]"></div>
    </div>
  );
}
