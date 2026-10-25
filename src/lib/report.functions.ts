import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getReport = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["REPORT_PASSWORD"];
    if (!expected || data.password !== expected) return { ok: false as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("page_stats").select("day, metric, count").order("day", { ascending: false }).limit(2000);
    if (error) throw new Error("Falha ao ler os dados");
    return { ok: true as const, rows: (rows ?? []).map((r) => ({ day: r.day, metric: r.metric, count: Number(r.count) })) };
  });
