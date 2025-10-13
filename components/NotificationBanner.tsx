'use client';

import { useEffect, useRef } from 'react';

interface NotificationBannerProps {
  stripeConnectInstance: any;
  detailsSubmitted?: boolean;
}

export default function NotificationBanner({ stripeConnectInstance, detailsSubmitted = true }: NotificationBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stripeConnectInstance || !containerRef.current) return;

    const notificationBanner = stripeConnectInstance.create('notification-banner');

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(notificationBanner);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [stripeConnectInstance]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Banner</h3>
      {!detailsSubmitted && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <span className="font-semibold">Note:</span> This account has details_submitted set to false.
            The notification banner will not display any notifications regardless of account requirements
            until the account details have been submitted.
          </p>
        </div>
      )}
      <div ref={containerRef} className="min-h-[60px]"></div>
    </div>
  );
}
