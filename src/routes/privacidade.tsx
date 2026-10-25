import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CONSENT_KEY, PIXEL_ID, saveConsent } from "@/lib/meta-pixel";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade | Radar de Perfumes" },
      { name: "description", content: "Como o Radar de Perfumes usa cookies e o Meta Pixel para medir visitas." },
      { property: "og:title", content: "Privacidade | Radar de Perfumes" },
      { property: "og:description", content: "Uso de cookies e medição publicitária no Radar de Perfumes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const [measurementAllowed, setMeasurementAllowed] = useState(false);
  const [privacyControlEnabled, setPrivacyControlEnabled] = useState(false);

  useEffect(() => {
    try {
      setMeasurementAllowed(window.localStorage.getItem(CONSENT_KEY) === "granted");
    } catch {
      setMeasurementAllowed(false);
    }
    setPrivacyControlEnabled(
      (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
    );
  }, []);

  const changeMeasurementPermission = (allowed: boolean) => {
    saveConsent(allowed ? "granted" : "denied");
    setMeasurementAllowed(allowed);
  };

  return (
    <main className="lux-bg min-h-screen px-5 py-10 text-foreground">
      <article className="mx-auto max-w-xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h1 className="font-display text-3xl text-foreground">Privacidade e cookies</h1>
        <p>Com sua permissão, usamos o Meta Pixel (ID {PIXEL_ID}) para medir visitas à página (PageView) e cliques no botão do grupo disponível do WhatsApp (Lead), e para melhorar nossos anúncios no Facebook e Instagram.</p>
        <p>Esses eventos compartilham com a Meta o endereço da página, informações do navegador, dispositivo e rede, e identificadores/cookies gerados pelo Pixel. Não enviamos nome, email, telefone ou listas de clientes.</p>
        <p>No Brasil, na Europa e em outras regiões que exigem consentimento, o Pixel só é ativado quando você marca a opção de autorização, que é opcional. Sem autorização, essas visitas e cliques não são enviados à Meta. Em outras regiões, a medição pode ser ativada por padrão, com possibilidade de recusa. O sinal Global Privacy Control do navegador também impede a medição.</p>
        <p>Guardamos no seu navegador sua escolha, a data e a versão da informação apresentada, para respeitá-la nas próximas visitas. A autorização pode ser retirada a qualquer momento. O acesso ao grupo funciona com ou sem medição.</p>
        <div className="flex items-start gap-3 rounded-md border border-white/15 p-3">
          <input
            id="privacy-meta-permission"
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-amber-500"
            checked={measurementAllowed && !privacyControlEnabled}
            disabled={privacyControlEnabled}
            onChange={(event) => changeMeasurementPermission(event.currentTarget.checked)}
          />
          <label htmlFor="privacy-meta-permission">
            Autorizo a medição de visitas e cliques com o Meta Pixel (opcional).
            {privacyControlEnabled && <span className="block">Seu navegador bloqueia a medição publicitária.</span>}
          </label>
        </div>
        <p>Veja também a <a className="underline" href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Política de Privacidade da Meta</a>.</p>
        <p><Link to="/" className="underline">Voltar</Link></p>
      </article>
    </main>
  );
}
