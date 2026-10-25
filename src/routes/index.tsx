import { createFileRoute } from "@tanstack/react-router";
import bottles from "@/assets/bottles.jpg.asset.json";
import { GroupButtons } from "@/components/group-buttons";
import { useEffect } from "react";
import { countMetric, watchMetaPageView } from "@/lib/metrics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Radar de Perfumes | Perfumes masculinos originais" },
      { name: "description", content: "Receba ofertas selecionadas de perfumes masculinos originais direto no WhatsApp." },
      { property: "og:title", content: "Radar de Perfumes | Perfumes masculinos originais" },
      { property: "og:description", content: "Ofertas e cupons de perfumes masculinos no grupo VIP do WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => { countMetric("page_view"); return watchMetaPageView(); }, []);
  return (
    <main className="lux-bg flex min-h-screen justify-center overflow-hidden px-5 py-9 text-foreground sm:py-12">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <p className="flex items-center gap-3 text-xs text-gold">
          <span className="h-px w-10 bg-gold/60" /> PERFUMES MASCULINOS <span className="h-px w-10 bg-gold/60" />
        </p>
        <h1 className="font-display mt-6 text-[2.75rem] leading-[1.05] sm:text-5xl">
          Seu próximo perfume original com até <span className="text-gold-gradient">60% de desconto</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Receba ofertas selecionadas de perfumes masculinos direto no WhatsApp.
        </p>
        <div className="perfume-composition mt-5">
          <img src={bottles.url} alt="Perfumes Sauvage, 1 Million e Bleu de Chanel" width="768" height="576" className="perfume-image" />
        </div>
        <GroupButtons />
        <p className="mt-5 text-sm text-muted-foreground">Ofertas e cupons em um só lugar.</p>
      </div>
    </main>
  );
}
