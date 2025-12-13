'use client';

import inEU from '@segment/in-eu';
import { usePathname, useSearchParams } from 'next/navigation';
import { Router } from 'next/router';
import Script from 'next/script';
import posthog from 'posthog-js';
import { Suspense, useEffect, useState } from 'react';

const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
const baseDir = process.env.NEXT_PUBLIC_BASE_DIR || '';

function HubSpot() {
  const hsId = process.env.NEXT_PUBLIC_HUBSPOT_ID;
  const [loadHs, setLoadHs] = useState(false);
  const [afterLoad, setAfterLoad] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window) {
      setLoadHs(!inEU());
    }
  }, [loadHs]);

  useEffect(() => {
    // @ts-ignore
    const hs = window?._hsq;
    if (afterLoad && pathname && hs) {
      let path = `${baseDir}${pathname}`;
      if (searchParams && searchParams.toString()) {
        path = path + `?${searchParams.toString()}`;
      }
      hs.push(['setPath', path]);
      hs.push(['trackPageView']);
    }
  }, [afterLoad, pathname, searchParams]);

  return (
    <div>
      {hsId && isProd && loadHs && (
        <Script
          id="hs-script-loader"
          async
          defer
          src={`//js.hs-scripts.com/${hsId}.js`}
          onLoad={() => setAfterLoad(true)}
        ></Script>
      )}
    </div>
  );
}

export default function Scripts() {
  return (
    <Suspense fallback={<></>}>
      <HubSpot />
    </Suspense>
  );
}
