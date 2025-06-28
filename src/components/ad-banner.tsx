'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

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
  const adSenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (!adSenseId || adSenseId === 'ca-pub-xxxxxxxxxxxxxxxx' || !props['data-ad-slot']) {
    return (
        <div className={cn('flex justify-center my-8', className)}>
          <Card className="flex items-center justify-center w-full max-w-4xl h-24 bg-muted/30">
            <p className="text-muted-foreground">Advertisement Area</p>
          </Card>
        </div>
      );
  }

  return (
    <div className={cn('my-8 w-full text-center', className)}>
        <Script
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
