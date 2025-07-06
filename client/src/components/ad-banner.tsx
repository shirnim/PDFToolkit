'use client';

import { useEffect } from 'react';
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
