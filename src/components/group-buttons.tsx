import { Button } from "@/components/ui/button";
import { WHATSAPP_GROUP_URL, trackLeadOnce } from "@/lib/meta-lead";
import { countMetric } from "@/lib/metrics";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
    </svg>
  );
}

export function GroupButtons() {
  return (
    <div className="group-actions flex w-full flex-col gap-4">
      <div className="relative w-full pt-2">
        <span className="group-badge group-badge-available absolute left-1/2 top-0 -translate-x-1/2">VAGAS DISPONÍVEIS</span>
        <Button asChild variant="ghost" className="cta-whatsapp h-auto min-h-20 w-full gap-3 whitespace-normal rounded-xl px-4 py-5 text-sm font-bold hover:bg-transparent [&_svg]:size-7">
          <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" onClick={() => { countMetric("whatsapp_click"); trackLeadOnce(); }}>
            <WhatsAppIcon />
            <span>ENTRAR NO GRUPO COM VAGAS</span>
          </a>
        </Button>
      </div>
      <div className="relative w-full pt-2">
        <span className="group-badge group-badge-full absolute left-1/2 top-0 -translate-x-1/2">LOTADO</span>
        <Button disabled variant="ghost" className="cta-full h-auto min-h-18 w-full gap-3 whitespace-normal rounded-xl px-4 py-5 text-sm font-semibold disabled:opacity-100 [&_svg]:size-7">
          <WhatsAppIcon />
          <span>ENTRAR NO GRUPO #2</span>
        </Button>
      </div>
    </div>
  );
}