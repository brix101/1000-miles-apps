import { parseSalesTrafficReport } from "@/services/amz-report-sales.service";
import {
  createReport,
  getReportDocument,
  getReportDocumentId,
} from "@/services/amz-report-sp.service";
import logger from "@repo/logger";
import dayjs from "dayjs";

async function weeklySalesTrafficUpdateJob() {
  logger.info("Initializing Sales and Traffic update cron job...");
  try {
    const endTime = dayjs().utcOffset(0).subtract(1, "day");
    const startTime = endTime.subtract(1, "week");

    const dataStartTime = startTime.format("YYYY-MM-DD");
    const dataEndTime = endTime.format("YYYY-MM-DD");

    const createReportResponse = await createReport({
      reportType: "GET_SALES_AND_TRAFFIC_REPORT",
      reportOptions: {
        dateGranularity: "DAY",
        asinGranularity: "CHILD",
      },
      marketplaceIds: ["ATVPDKIKX0DER"],
      dataStartTime,
      dataEndTime: dataStartTime,
    });
    const reportData = await getReportDocumentId(createReportResponse);
    const reportDocument = await getReportDocument(reportData);

    const items = await parseSalesTrafficReport(reportDocument);
    logger.info(items);
    // logger.info(items.salesAndTrafficByAsin);

    logger.info(
      `${`${dataStartTime}--${dataEndTime}`} inserted to marketplaces`,
      "Marketplace update job executed successfully."
    );
  } catch (error) {
    logger.error(error, "Error executing weekly Sales and Traffic update job:");
  }
}

export default weeklySalesTrafficUpdateJob;
