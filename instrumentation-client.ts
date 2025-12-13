import posthog from 'posthog-js';
import inEU from '@segment/in-eu';

const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

const initPostHog = () => {
  if (inEU() || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
    api_host: isProd ? '/i' : process.env.NEXT_PUBLIC_POSTHOG_HOST, // See Posthog rewrites in next config
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30',
    person_profiles: 'always',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
};

initPostHog();