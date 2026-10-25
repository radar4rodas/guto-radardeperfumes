export type StatRow = { day: string; metric: string; count: number };

export function summarize(rows: StatRow[]) {
  const sum = (m: string) => rows.filter((r) => r.metric === m).reduce((a, r) => a + r.count, 0);
  const visits = sum("page_view");
  const clicks = sum("whatsapp_click");
  return {
    visits,
    clicks,
    metaPageViews: sum("meta_pageview"),
    metaLeads: sum("meta_lead"),
    conversion: visits > 0 ? (clicks / visits) * 100 : 0,
  };
}
