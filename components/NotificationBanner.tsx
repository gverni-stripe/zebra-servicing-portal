'use client';

import { useEffect, useRef } from 'react';

interface NotificationBannerProps {
  stripeConnectInstance: any;
}

export default function NotificationBanner({ stripeConnectInstance }: NotificationBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stripeConnectInstance || !containerRef.current) return;

    const notificationBanner = stripeConnectInstance.create('notification-banner');
    notificationBanner.setOnNotificationBannerClosed(() => {
      console.log('Notification banner closed');
    });

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
      <div ref={containerRef} className="min-h-[60px]"></div>
    </div>
  );
}
