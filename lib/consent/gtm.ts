import type { ConsentPreferences } from "./types";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// EU/EEA/UK — Google's own region list for its regional consent default.
const EU_EEA_UK_REGIONS = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
];

/**
 * Builds the inline Google Consent Mode v2 default script that must run
 * before GTM loads.
 *
 * This app is a read-only consumer of the `az-consent` cookie set by the
 * marketing site (see ./storage) — it never shows its own banner. When the
 * cookie already reflects a decision, apply it directly as the Consent Mode
 * default so there's no flash of denied-then-granted. Otherwise fall back
 * to the same region-based default the marketing site uses before a
 * decision has been made.
 */
export function buildConsentDefaultScript(consent: ConsentPreferences | null): string {
  if (consent) {
    return `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        analytics_storage: '${consent.statistics ? "granted" : "denied"}',
        ad_storage: '${consent.marketing ? "granted" : "denied"}',
        ad_user_data: '${consent.marketing ? "granted" : "denied"}',
        ad_personalization: '${consent.marketing ? "granted" : "denied"}',
        functionality_storage: '${consent.preferences ? "granted" : "denied"}',
        personalization_storage: '${consent.preferences ? "granted" : "denied"}',
        security_storage: 'granted'
      });
    `;
  }

  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    // Global default: granted (non-EU visitors)
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
      security_storage: 'granted'
    });

    // EU/EEA/UK override: denied until explicit consent
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      wait_for_update: 1000,
      region: ${JSON.stringify(EU_EEA_UK_REGIONS)}
    });
  `;
}

/** Builds the standard GTM loader snippet for the given container ID. */
export function buildGtmLoaderScript(gtmId: string): string {
  return `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
}
