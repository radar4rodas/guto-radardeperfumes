import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import bottles from "@/assets/bottles.jpg.asset.json";
import { GroupButtons } from "@/components/group-buttons";
import { countMetric, watchMetaPageView } from "@/lib/metrics";

const COUNTDOWN_SECONDS = 120;
const COUNTDOWN_STORAGE_KEY = "radar-perfumes-vip-countdown-deadline";

function useVipCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const now = Date.now();
    let deadline = now + COUNTDOWN_SECONDS * 1000;

    // Keep the same two-minute countdown across reloads in this browser tab.
    try {
      const saved = Number(window.sessionStorage.getItem(COUNTDOWN_STORAGE_KEY));
      if (Number.isFinite(saved) && saved > 0 && saved <= now + COUNTDOWN_SECONDS * 1000) {
        deadline = saved;
      } else {
        window.sessionStorage.setItem(COUNTDOWN_STORAGE_KEY, String(deadline));
      }
    } catch {
      // The timer still runs normally if browser storage is disabled.
    }

    const tick = () => {
      setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    };

    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, []);

  return {
    minutes: String(Math.floor(secondsLeft / 60)).padStart(2, "0"),
    seconds: String(secondsLeft % 60).padStart(2, "0"),
  };
}

function VacancyCountdown() {
  const { minutes, seconds } = useVipCountdown();

  return (
    <section className="vip-countdown" aria-label="Contagem regressiva de dois minutos">
      <h2 className="vip-countdown-heading">
        <span className="vip-flame" aria-hidden="true">🔥</span>
        <span>ÚLTIMAS VAGAS GRÁTIS</span>
      </h2>
      <p className="vip-countdown-caption">Restam poucas vagas</p>
      <div className="vip-counter-clock" role="timer" aria-label={`${minutes} minutos e ${seconds} segundos restantes`}>
        <div className="vip-counter-column">
          <span className="vip-counter-number">{minutes}</span>
          <span className="vip-counter-label">MINUTOS</span>
        </div>
        <span className="vip-counter-divider" aria-hidden="true">:</span>
        <div className="vip-counter-column">
          <span className="vip-counter-number">{seconds}</span>
          <span className="vip-counter-label">SEGUNDOS</span>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Radar de Perfumes | Entre no grupo VIP" },
      { name: "description", content: "Ofertas selecionadas de perfumes masculinos. Acesse gratuitamente nosso grupo VIP de WhatsApp." },
      { property: "og:title", content: "Radar de Perfumes | Grupo VIP" },
      { property: "og:description", content: "Ofertas selecionadas de perfumes masculinos no WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    countMetric("page_view");
    return watchMetaPageView();
  }, []);

  return (
    <main className="vip-landing">
      <div className="vip-page">
        <header className="vip-intro">
          <p className="vip-kicker">PERFUMARIA MASCULINA</p>
          <h1 className="vip-headline">
            <span className="vip-headline-main">ENTRE NO GRUPO VIP</span>
            <span className="vip-headline-offer">PERFUMES ORIGINAIS COM ATÉ 60% DE DESCONTO</span>
          </h1>
        </header>

        <div className="vip-hero-stage">
          <figure className="vip-perfumes">
            <img
              src={bottles.url}
              alt="Seleção de frascos de perfumes masculinos"
              width="768"
              height="576"
              fetchPriority="high"
            />
          </figure>
        </div>

        <VacancyCountdown />
        <GroupButtons />
      </div>
    </main>
  );
}
