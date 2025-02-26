'use client';

import inEU from '@segment/in-eu';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

function Reo() {
  const reoClientId = process.env.NEXT_PUBLIC_REO_CLIENT_ID;
  const [loadReo, setLoadReo] = useState(false);
  const [afterLoad, setAfterLoad] = useState(false);

  useEffect(() => {
    if (window) {
      setLoadReo(!inEU());
    }
  }, [loadReo]);

  useEffect(() => {
    // @ts-ignore
    if (afterLoad && window.Reo) {
      // @ts-ignore
      window.Reo.init({ clientID: reoClientId });
    }
  }, [afterLoad]);

  return (
    <div>
      {reoClientId && isProd && loadReo && (
        <Script
          src={`https://static.reo.dev/${reoClientId}/reo.js`}
          onLoad={() => setAfterLoad(true)}
          defer
        ></Script>
      )}
    </div>
  );
}

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
      let path = pathname;
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
    <div>
      <Reo />
      <HubSpot />
    </div>
  );
}
