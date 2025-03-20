import { createSaleAndTraffic } from "@/services/sale-and-traffic.service";
import logger from "@repo/logger";
import dayjs from "dayjs";

async function dailySalesTrafficUpdateJob() {
  logger.info("Initializing Sales and Traffic update cron job...");
  try {
    const dateNow = dayjs().utcOffset(0).subtract(2, "day");
    const dataStartTime = dateNow.format("YYYY-MM-DD");

    // const marketplaces = await getMarketplaces();
    const marketplaceId = "ATVPDKIKX0DER";
    await createSaleAndTraffic({
      marketplaceId,
      dataStartTime,
      dataEndTime: dataStartTime,
    });

    logger.info("Daily Sales and Traffic update job executed successfully.");
  } catch (error) {
    logger.error(error, "Error executing weekly Sales and Traffic update job:");
  }
}

export default dailySalesTrafficUpdateJob;
