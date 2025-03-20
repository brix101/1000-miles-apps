import dayjs from "dayjs";

export function createSaleAndTrafficInterval(period: string) {
  const currentDate = dayjs().utcOffset(0).subtract(2, "day");

  let startTime = currentDate;
  let endTime = currentDate;

  switch (period) {
    case "YESTERDAY":
      startTime = currentDate.subtract(1, "day");
      endTime = currentDate.subtract(1, "day");
      break;
    case "WEEK":
      startTime = currentDate.startOf("week");
      endTime = startTime.endOf("week");
      break;
    case "MONTH":
      startTime = currentDate.startOf("month");
      endTime = startTime.endOf("month");
      break;
    case "QUARTER":
      startTime = currentDate.startOf("quarter");
      endTime = startTime.endOf("quarter");
      break;
    case "FINANCIAL_YEAR":
      startTime = currentDate.startOf("year");
      endTime = startTime.endOf("year");
      break;
    default: // For 'Day' and 'Custom' granularities
      startTime = currentDate.startOf("day");
      endTime = currentDate.startOf("day");
      break;
    // Add more cases for other granularities if needed
  }

  const dataStartTime = startTime.format("YYYY-MM-DD");
  const dataEndTime = endTime.format("YYYY-MM-DD");

  return { dataStartTime, dataEndTime };
}

export function parseFormatedInterval(interval?: string) {
  if (!interval) {
    return;
  }

  const [startDateString, endDateString] = interval.split("--");
  const startTime = dayjs(startDateString);
  const endTime = dayjs(endDateString);

  const dataStartTime = startTime.format("YYYY-MM-DD");
  const dataEndTime = endTime.format("YYYY-MM-DD");

  return { dataStartTime, dataEndTime };
}

export function getSATComparisonInterval(
  comparison: string,
  intervalRange: string
) {
  const currentDate = dayjs().utcOffset(0).subtract(2, "day");

  const [startString, endString] = intervalRange.split("--");
  const startDate = dayjs(startString).utcOffset(0);
  const endDate = dayjs(endString).utcOffset(0);

  let startTime: dayjs.Dayjs;
  let endTime: dayjs.Dayjs;

  const daysDifference = endDate.diff(startDate, "day");

  // Calculate the same date range based on the specified time unit
  switch (comparison) {
    case "LAST_WEEK":
      endTime = currentDate.subtract(1, "week");
      startTime = endTime.subtract(daysDifference, "day");
      break;

    case "LAST_MONTH":
      endTime = currentDate.subtract(1, "month");
      startTime = endTime.subtract(daysDifference, "day");
      break;

    case "LAST_YEAR":
      endTime = currentDate.subtract(1, "year");
      startTime = endTime.subtract(daysDifference, "day");
      break;

    default:
      endTime = currentDate.subtract(1, "day").endOf("day");
      startTime = endTime.startOf("day");
      break;
  }

  const dataStartTime = startTime.format("YYYY-MM-DD");
  const dataEndTime = endTime.format("YYYY-MM-DD");

  return { dataStartTime, dataEndTime };
}
