import { createFileRoute, Link } from "@tanstack/react-router";
import { PIXEL_ID } from "@/lib/meta-pixel";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade | Radar de Perfumes" },
      { name: "description", content: "Como o Radar de Perfumes usa o Meta Pixel para medir visitas e cliques." },
      { property: "og:title", content: "Privacidade | Radar de Perfumes" },
      { property: "og:description", content: "Informações sobre o uso do Meta Pixel no Radar de Perfumes." },
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
        <p>Esta página carrega automaticamente o Meta Pixel (ID {PIXEL_ID}) para medir visitas (PageView) e o primeiro clique no botão do WhatsApp (Lead), com finalidade de análise e campanhas no Facebook e Instagram.</p>
        <p>Os eventos podem compartilhar com a Meta a URL visitada, dados técnicos do navegador, dispositivo e rede, além de identificadores e cookies utilizados pelo Pixel. Não enviamos diretamente nome, email, telefone ou listas de clientes pelo nosso código de eventos.</p>
        <p>Para reduzir eventos duplicados, salvamos no armazenamento local do navegador que um Lead já foi enviado. A navegação e o acesso ao grupo não dependem da medição; extensões ou configurações do navegador podem bloquear o Pixel.</p>
        <p>Para saber como a Meta trata esses dados, consulte a <a className="underline" href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Política de Privacidade da Meta</a>.</p>
        <p><Link to="/" className="underline">Voltar</Link></p>
      </article>
    </main>
  );
}
