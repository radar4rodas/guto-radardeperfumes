import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getReport } from "@/lib/report.functions";
import { summarize, type StatRow } from "@/lib/report-math";

export const Route = createFileRoute("/relatorio")({
  head: () => ({
    meta: [
      { title: "Relatório | Radar de Perfumes" },
      { name: "description", content: "Relatório interno de visitas e cliques do Radar de Perfumes." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Relatório | Radar de Perfumes" },
      { property: "og:description", content: "Relatório interno de visitas e cliques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Report,
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-left">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Report() {
  const fetchReport = useServerFn(getReport);
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<StatRow[] | null>(null);
  const [error, setError] = useState("");

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetchReport({ data: { password } });
      if (!res.ok) { setError("Senha incorreta."); return; }
      setRows(res.rows);
    } catch {
      setError("Não foi possível carregar agora.");
    }
  }

  if (!rows) {
    return (
      <main className="lux-bg flex min-h-screen items-center justify-center px-5 text-foreground">
        <form onSubmit={load} className="w-full max-w-xs space-y-3">
          <h1 className="font-display text-2xl">Relatório</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          <button type="submit" className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Entrar</button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </main>
    );
  }

  const s = summarize(rows);
  const days = [...new Set(rows.map((r) => r.day))];
  const by = (day: string, m: string) => rows.find((r) => r.day === day && r.metric === m)?.count ?? 0;

  return (
    <main className="lux-bg min-h-screen px-5 py-10 text-foreground">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-3xl">Relatório</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Visitas" value={String(s.visits)} />
          <Stat label="Cliques no WhatsApp" value={String(s.clicks)} />
          <Stat label="Conversão" value={`${s.conversion.toFixed(1)}%`} />
          <Stat label="PageView enviados à Meta" value={String(s.metaPageViews)} />
          <Stat label="Lead enviados à Meta" value={String(s.metaLeads)} />
        </div>
        <p className="text-xs text-muted-foreground">Contagens sem cookies e sem dados pessoais. "Enviados à Meta" conta o que o navegador disparou com consentimento; o recebimento é confirmado no Gerenciador de Eventos.</p>
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground"><tr><th className="py-2">Dia</th><th>Visitas</th><th>Cliques</th><th>PageView Meta</th><th>Lead Meta</th></tr></thead>
          <tbody>
            {days.map((d) => (
              <tr key={d} className="border-t border-border"><td className="py-2">{d}</td><td>{by(d, "page_view")}</td><td>{by(d, "whatsapp_click")}</td><td>{by(d, "meta_pageview")}</td><td>{by(d, "meta_lead")}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
