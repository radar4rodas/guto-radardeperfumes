export const PIXEL_ID = "1104208202495234";
export const CONSENT_KEY = "advertising_consent"; // "granted" | "denied"
export const CONSENT_RECORD_KEY = "advertising_consent_record";
export const CONSENT_NOTICE_VERSION = "2026-10-24-v1";
export const CONSENT_NOTICE_TEXT = "Usamos cookies para medir visitas e melhorar nossos anúncios.";
export const CONSENT_EVENT = "radar:consent-needed";

// Regions where advertising measurement needs the visitor's explicit acceptance.
export const CONSENT_REGIONS = "AT BE BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LI LV LT LU MT NL NO PL PT RO SK SI ES SE GB CH BR CA KR TR ZA".split(" ");

export function requiresConsent(country: string): boolean {
  return !/^[A-Z]{2}$/.test(country) || ["XX", "T1", ...CONSENT_REGIONS].includes(country);
}

/** Whether measurement may run for a country given the stored choice. Silence never counts as acceptance. */
export function permitsAdvertising(country: string, choice: string | null = null, gpc = false): boolean {
  if (gpc || choice === "denied") return false;
  if (requiresConsent(country)) return choice === "granted";
  return true;
}

type RadarWindow = Window & {
  __radarAdvertisingAllowed?: boolean;
  __radarLoadPixel?: () => void;
  __radarNeedsConsent?: boolean;
  fbq?: (...a: unknown[]) => void;
};

export function advertisingPermittedNow(): boolean {
  if (typeof window === "undefined") return false;
  const state = window as RadarWindow;
  const browser = navigator as Navigator & { globalPrivacyControl?: boolean };
  try {
    return state.__radarAdvertisingAllowed === true && !browser.globalPrivacyControl &&
      window.localStorage.getItem(CONSENT_KEY) !== "denied";
  } catch {
    return false;
  }
}

/** Records the visitor's choice with evidence and applies it immediately. */
export function saveConsent(choice: "granted" | "denied") {
  const w = window as RadarWindow;
  try {
    const prev = window.localStorage.getItem(CONSENT_RECORD_KEY);
    const history = prev ? (JSON.parse(prev).history ?? []) : [];
    const entry = { choice, at: new Date().toISOString(), noticeVersion: CONSENT_NOTICE_VERSION, noticeText: CONSENT_NOTICE_TEXT, purposes: ["advertising_measurement"], recipient: "Meta (Facebook/Instagram)" };
    window.localStorage.setItem(CONSENT_KEY, choice);
    window.localStorage.setItem(CONSENT_RECORD_KEY, JSON.stringify({ ...entry, history: [...history, entry].slice(-10) }));
  } catch {
    /* storage unavailable: choice applies to this visit only */
  }
  w.__radarNeedsConsent = false;
  if (choice === "granted") {
    w.__radarLoadPixel?.();
  } else {
    w.__radarAdvertisingAllowed = false;
    if (typeof w.fbq === "function") w.fbq("consent", "revoke");
  }
}

/** Clears the saved choice (keeps the evidence history) so the notice is shown again. */
export function reopenConsent() {
  const w = window as RadarWindow;
  try { window.localStorage.removeItem(CONSENT_KEY); } catch { /* ignore */ }
  w.__radarAdvertisingAllowed = false;
  if (typeof w.fbq === "function") w.fbq("consent", "revoke");
  w.__radarNeedsConsent = true;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// Official Meta bootstrap, loaded once per document, only when measurement is permitted.
export const PIXEL_SNIPPET = `(function(){
if(window.__radarPixelStarted)return;window.__radarPixelStarted=true;
window.__radarAdvertisingAllowed=false;
function choice(){try{return localStorage.getItem('${CONSENT_KEY}');}catch(e){return null;}}
function gpc(){return navigator.globalPrivacyControl===true;}
var loaded=false;
window.__radarLoadPixel=function(){
if(gpc()||choice()==='denied')return;
window.__radarAdvertisingAllowed=true;
if(loaded){window.fbq('consent','grant');return;}
loaded=true;
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}',{},{agent:'lovable'});fbq('track','PageView');
window.__radarMetaPvPending=true;window.dispatchEvent(new Event('radar:meta-pageview'));
};
function needConsent(){window.__radarNeedsConsent=true;window.dispatchEvent(new Event('${CONSENT_EVENT}'));}
var regions=${JSON.stringify([...CONSENT_REGIONS, "XX", "T1"])};
var controller=new AbortController();var timeout=setTimeout(function(){controller.abort();},2000);
fetch('/cdn-cgi/trace',{signal:controller.signal,credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error('region');return r.text();}).then(function(text){
var m=text.match(/^loc=([A-Z0-9]{2})$/m);return m?m[1]:'';
}).catch(function(){return '';}).then(function(country){
clearTimeout(timeout);
if(gpc()||choice()==='denied')return;
var needs=!/^[A-Z]{2}$/.test(country)||regions.indexOf(country)!==-1;
if(!needs||choice()==='granted'){window.__radarLoadPixel();return;}
needConsent();
});
window.addEventListener('storage',function(e){if(e.key!=='${CONSENT_KEY}')return;
if(choice()==='denied'){window.__radarAdvertisingAllowed=false;if(typeof window.fbq==='function')window.fbq('consent','revoke');}
else if(choice()==='granted'){window.__radarLoadPixel();}});
})();`;
