import SaleModel from "@/models/sale.model";
import type {
  Granularity,
  OrderMetricsQueryParams,
} from "@/schemas/sale.schema";
import apiSPInstance from "@/utils/api-sp-instance";
import type { OrderMetricsInterval } from "@repo/schema";
import dayjs from "dayjs";

export const periodGranularity: Record<string, Granularity> = {
  YESTERDAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
  QUARTER: "Month",
  FINANCIAL_YEAR: "Year",
  CUSTOM_PERIOD: "Total",
};

/**
 * Gets the granularity and interval based on the specified period.
 * @param period - The period for which to get the granularity and interval.
 * @returns An object containing the granularity and interval.
 */
export function getGranularityInterval(period: string): {
  granularity: Granularity;
  interval: string;
} {
  const granularity = periodGranularity[period];
  const interval = createInterval(period);

  return { granularity, interval };
}

/**
 * Parses a date interval string into a formatted string suitable for queries.
 * @param interval - The date interval string in the format "startDate--endDate".
 * @returns A formatted string representing the interval suitable for queries,
 *          or undefined if the input interval is undefined or empty.
 */
export function parseQueryInterval(interval?: string) {
  if (!interval) {
    return;
  }

  const [startDateString, endDateString] = interval.split("--");
  const endDate = dayjs(endDateString)
    .utcOffset(0)
    .startOf("day")
    .toISOString();

  return `${startDateString}--${endDate}`;
}

/**
 * Creates a date interval string based on the specified period.
 * @param period - The period for which to create the interval.
 * @returns A string representing the interval in the format "startDate--endDate".
 */
export function createInterval(period: string): string {
  const currentDate = dayjs().utcOffset(0);

  let intervalStart = currentDate.startOf("day");
  let intervalEnd = currentDate.startOf("day");

  switch (period) {
    case "YESTERDAY":
      intervalStart = currentDate.subtract(1, "day").startOf("day");
      intervalEnd = currentDate.subtract(1, "day").endOf("day");
      break;
    case "WEEK":
      intervalStart = currentDate.startOf("week").add(1, "day");
      intervalEnd = intervalStart.endOf("week").startOf("day");
      break;
    case "MONTH":
      intervalStart = currentDate.startOf("month").add(1, "day");
      intervalEnd = intervalStart
        .endOf("month")
        .subtract(1, "day")
        .startOf("day");
      break;
    case "QUARTER":
      intervalStart = currentDate.startOf("quarter").add(1, "day");
      intervalEnd = intervalStart
        .endOf("quarter")
        .subtract(1, "day")
        .startOf("day");
      break;
    case "FINANCIAL_YEAR":
      intervalStart = currentDate.startOf("year").add(1, "day");
      intervalEnd = intervalStart
        .endOf("year")
        .subtract(1, "day")
        .startOf("day");
      break;
    default: // For 'Day' and 'Custom' granularities
      intervalStart = currentDate.startOf("day");
      intervalEnd = currentDate.startOf("day");
      break;
    // Add more cases for other granularities if needed
  }

  return `${intervalStart.toISOString()}--${intervalEnd.toISOString()}`;
}

/**
 * Gets the comparison interval based on the specified comparison and interval range.
 * @param comparison - The type of comparison ("LAST_WEEK", "LAST_MONTH", "LAST_YEAR", or "CUSTOM").
 * @param intervalRange - The interval range in the format "startDate--endDate".
 * @returns A string representing the comparison interval in the format "startDate--endDate".
 */
export function getComparisonInterval(
  comparison: string,
  intervalRange: string
): string {
  const currentDate = dayjs().utcOffset(0).endOf("day");

  const [startString, endString] = intervalRange.split("--");
  const startDate = dayjs(startString).utcOffset(0);
  const endDate = dayjs(endString).utcOffset(0);

  let lastStartDate: dayjs.Dayjs;
  let lastEndDate: dayjs.Dayjs;

  const daysDifference = endDate.diff(startDate, "day") + 1;

  // Calculate the same date range based on the specified time unit
  switch (comparison) {
    case "LAST_WEEK":
      lastEndDate = currentDate.subtract(1, "week");
      lastStartDate = lastEndDate.subtract(daysDifference, "day");
      break;

    case "LAST_MONTH":
      lastEndDate = currentDate.subtract(1, "month");
      lastStartDate = lastEndDate.subtract(daysDifference, "day");
      break;

    case "LAST_YEAR":
      lastEndDate = currentDate.subtract(1, "year");
      lastStartDate = lastEndDate.subtract(daysDifference, "day");
      break;

    default:
      lastEndDate = currentDate.subtract(1, "day").endOf("day");
      lastStartDate = lastEndDate.startOf("day");
      break;
  }

  // Format the result as a string
  const formattedDateRange = `${lastStartDate.startOf("day").toISOString()}--${lastEndDate.startOf("day").toISOString()}`;

  return formattedDateRange;
}

/**
 * Retrieves order metrics data from the API based on specified parameters.
 * @param orderMetrics - An object containing parameters for fetching order metrics.
 * @returns A promise that resolves to an object containing aggregated order metrics.
 */
export async function getOrderMetrics(params: OrderMetricsQueryParams) {
  const key = JSON.stringify(params);

  const salesData = await SaleModel.findOne({ key }).lean();

  if (salesData) {
    return processOrderMetrics(salesData.orderMetrics, params.interval);
  }

  const response = await apiSPInstance.get<{ payload: OrderMetricsInterval[] }>(
    "/sales/v1/orderMetrics",
    {
      params,
    }
  );

  await SaleModel.create({ key, orderMetrics: response.data.payload });

  return processOrderMetrics(response.data.payload, params.interval);
}

function processOrderMetrics(
  orderMetrics: OrderMetricsInterval[],
  interval: string
) {
  return orderMetrics.reduce(
    (acc, item) => {
      acc.unitCount += item.unitCount || 0;
      acc.orderItemCount += item.orderItemCount || 0;
      acc.orderCount += item.orderCount || 0;
      acc.averageUnitPrice.amount += item.averageUnitPrice.amount || 0;
      acc.totalSales.amount += item.totalSales.amount || 0;
      return acc;
    },
    {
      interval,
      unitCount: 0,
      orderItemCount: 0,
      orderCount: 0,
      averageUnitPrice: { amount: 0, currencyCode: "USD" },
      totalSales: { amount: 0, currencyCode: "USD" },
    }
  );
}
