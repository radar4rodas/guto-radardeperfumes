import { createFileRoute, Link } from "@tanstack/react-router";
import { reopenConsent } from "@/lib/meta-pixel";

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
  return (
    <main className="lux-bg min-h-screen px-5 py-10 text-foreground">
      <article className="mx-auto max-w-xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h1 className="font-display text-3xl text-foreground">Privacidade e cookies</h1>
        <p>Com sua permissão, usamos o Meta Pixel (ID 1104208202495234) para medir visitas à página (PageView) e cliques no botão do grupo disponível do WhatsApp (Lead), e para melhorar nossos anúncios no Facebook e Instagram.</p>
        <p>Esses eventos compartilham com a Meta o endereço da página, informações do navegador, dispositivo e rede, e identificadores/cookies gerados pelo Pixel. Não enviamos nome, email, telefone ou listas de clientes.</p>
        <p>No Brasil, na Europa e em outras regiões que exigem consentimento, o Pixel só é carregado depois que você clica em "Aceitar". Se você recusar ou não responder, nada é enviado. Em outras regiões, a medição é ativada por padrão e você pode recusá-la abaixo. O sinal Global Privacy Control do navegador também impede a medição.</p>
        <p>Guardamos no seu navegador a sua escolha, a data e a versão do aviso exibido, para respeitá-la nas próximas visitas. O acesso ao grupo funciona com ou sem medição.</p>
        <p>
          <button type="button" className="underline underline-offset-2 text-foreground" onClick={reopenConsent}>Alterar minha preferência de cookies</button>
        </p>
        <p>Veja também a <a className="underline" href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Política de Privacidade da Meta</a>.</p>
        <p><Link to="/" className="underline">Voltar</Link></p>
      </article>
    </main>
  );
}
