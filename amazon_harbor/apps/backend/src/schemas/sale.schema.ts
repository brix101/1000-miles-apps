export type Granularity =
  | "Day"
  | "Week"
  | "Month"
  | "Quarter"
  | "Year"
  | "Total"
  | "Custom";

export interface OrderMetricsQueryParams {
  marketplaceIds: string;
  granularity: Granularity;
  interval: string;
  sku?: string;
}
