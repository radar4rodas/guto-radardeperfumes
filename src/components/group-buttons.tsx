import { WHATSAPP_GROUP_URL, trackLeadOnce } from "@/lib/meta-lead";
import { countMetric } from "@/lib/metrics";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="vip-whatsapp-icon" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
    </svg>
  );
}

export function GroupButtons() {
  return (
    <a
      className="vip-whatsapp-cta"
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        countMetric("whatsapp_click");
        trackLeadOnce();
      }}
    >
      <WhatsAppIcon />
      <span className="vip-cta-divider" aria-hidden="true" />
      <span className="vip-cta-label">ENTRAR NO GRUPO VIP</span>
      <svg className="vip-cta-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m8 4 8 8-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
