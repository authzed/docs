import { CONSENT_COOKIE_NAME, CONSENT_COOKIE_VERSION } from "./storage";

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
 * marketing site (see ./storage) — it never shows its own banner. The cookie
 * is read in the browser rather than on the server so the root layout stays
 * static (calling `cookies()` there would make every page dynamic, leaving no
 * prerendered HTML for the Pagefind search index). When the cookie already
 * reflects a decision, apply it directly as the Consent Mode default so
 * there's no flash of denied-then-granted. Otherwise fall back to the same
 * region-based default the marketing site uses before a decision has been
 * made.
 */
export function buildConsentDefaultScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    (function(){
      var consent = null;
      try {
        var prefix = ${JSON.stringify(CONSENT_COOKIE_NAME + "=")};
        var row = document.cookie.split("; ").find(function(r){ return r.indexOf(prefix) === 0; });
        if (row) {
          var parsed = JSON.parse(decodeURIComponent(row.slice(prefix.length)));
          if (parsed && parsed.version === ${CONSENT_COOKIE_VERSION}) consent = parsed;
        }
      } catch (e) {
        // invalid cookie
      }

      if (consent) {
        var g = function(v){ return v ? 'granted' : 'denied'; };
        gtag('consent', 'default', {
          analytics_storage: g(consent.statistics),
          ad_storage: g(consent.marketing),
          ad_user_data: g(consent.marketing),
          ad_personalization: g(consent.marketing),
          functionality_storage: g(consent.preferences),
          personalization_storage: g(consent.preferences),
          security_storage: 'granted'
        });
        return;
      }

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
    })();
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
