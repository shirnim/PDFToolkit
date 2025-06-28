'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle?: { [key:string]: unknown }[];
  }
}

type AdBannerProps = {
  className?: string;
  'data-ad-slot': string;
  'data-ad-format'?: string;
  'data-full-width-responsive'?: string;
};

const AdBanner = ({ className, ...props }: AdBannerProps) => {
  const adSenseId = "ca-pub-8477550300312829";

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (!props['data-ad-slot']) {
    return null;
  }

  return (
    <div className={cn('my-8 w-full text-center', className)}>
        <Script
            id={`adsbygoogle-script-${props['data-ad-slot']}`}
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adSenseId}
            {...props}
        ></ins>
    </div>
  );
};

export default AdBanner;
