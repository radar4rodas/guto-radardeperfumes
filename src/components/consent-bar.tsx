import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CONSENT_EVENT, CONSENT_NOTICE_TEXT, saveConsent } from "@/lib/meta-pixel";

export function ConsentBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    if ((window as Window & { __radarNeedsConsent?: boolean }).__radarNeedsConsent) setOpen(true);
    window.addEventListener(CONSENT_EVENT, show);
    return () => window.removeEventListener(CONSENT_EVENT, show);
  }, []);

  if (!open) return null;
  const choose = (c: "granted" | "denied") => { saveConsent(c); setOpen(false); };

  return (
    <div role="region" aria-label="Preferência de cookies" className="consent-bar">
      <p className="text-[11px] leading-snug text-muted-foreground">
        {CONSENT_NOTICE_TEXT}{" "}
        <Link to="/privacidade" className="underline underline-offset-2">Saiba mais</Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="consent-btn consent-accept" onClick={() => choose("granted")}>Aceitar</button>
        <button type="button" className="consent-btn consent-reject" onClick={() => choose("denied")}>Recusar</button>
      </div>
    </div>
  );
}
