'use client';

import { useEffect, useRef } from 'react';

interface PaymentsListProps {
  stripeConnectInstance: any;
}

export default function PaymentsList({ stripeConnectInstance }: PaymentsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stripeConnectInstance || !containerRef.current) return;

    const paymentsList = stripeConnectInstance.create('payments');

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(paymentsList);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [stripeConnectInstance]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments</h3>
      <div ref={containerRef} className="min-h-[300px]"></div>
    </div>
  );
}
