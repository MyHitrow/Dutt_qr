export interface AnalyticsEvent {
  id: string;
  type: "visit" | "product_view";
  timestamp: string; // ISO date string
  path?: string;
  table?: string;
  productId?: string;
  productName?: string;
  categoryId?: string;
  lang?: "tr" | "en";
}

export interface AnalyticsSummary {
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  totalVisits: number;
  dailyVisits: { date: string; label: string; count: number }[];
  topProducts: { id: string; name: string; count: number; categoryId?: string }[];
  hourlyDistribution: { hour: number; count: number }[];
  languages: { tr: number; en: number };
  tableVisits: { table: string; count: number }[];
}
