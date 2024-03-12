'use client';

import inEU from '@segment/in-eu';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function Scripts() {
  const [loadReo, setLoadReo] = useState(false);
  const [afterLoad, setAfterLoad] = useState(false);
  const isProd = process.env.VERCEL_ENV === 'production';

  useEffect(() => {
    if (window) {
      setLoadReo(!inEU());
    }
  }, [loadReo]);

  useEffect(() => {
    // @ts-ignore
    if (afterLoad && window.Reo) {
      // @ts-ignore
      window.Reo.init({ clientID: 'bf9727b30a874e3' });
    }
  }, [afterLoad]);

  return (
    <div>
      {isProd && loadReo && (
        <Script
          src="https://static.reo.dev/bf9727b30a874e3/reo.js"
          onLoad={() => setAfterLoad(true)}
        ></Script>
      )}
    </div>
  );
}
