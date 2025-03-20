import { createSaleAndTraffic } from "@/services/sale-and-traffic.service";
import logger from "@repo/logger";
import dayjs from "dayjs";

async function dailySalesTrafficJob() {
  logger.info("Initializing Sales and Traffic create cron job...");
  try {
    const dateNow = dayjs().utcOffset(0).subtract(2, "day");
    const dataStartTime = dateNow.format("YYYY-MM-DD");

    await createSaleAndTraffic({
      marketplaceId: "ATVPDKIKX0DER",
      dataStartTime,
      dataEndTime: dataStartTime,
    });

    logger.info("Daily Sales and Traffic create job executed successfully.");
  } catch (error) {
    logger.error(error, "Error executing weekly Sales and Traffic create job:");
  }
}

export default dailySalesTrafficJob;
