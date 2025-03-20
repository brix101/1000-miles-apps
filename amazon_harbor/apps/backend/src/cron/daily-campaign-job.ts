import dayjs from "dayjs";

import CampaignModel from "@/models/campaign.model";
import { getParsedADSReport } from "@/services/amz-report-ads.service";
import logger from "@repo/logger";

async function dailyCampaignJob() {
  logger.info("Initializing campaign cron job...");
  try {
    const dateNow = dayjs().utcOffset(0).subtract(2, "day");
    const dataStartTime = dateNow.format("YYYY-MM-DD");

    const campaignInterval = `${dataStartTime}--${dataStartTime}`;

    const adsProducts = await getParsedADSReport(dataStartTime, dataStartTime);

    await CampaignModel.findOneAndUpdate(
      { interval: campaignInterval },
      { interval: campaignInterval, adSponsoredProducts: adsProducts },
      { upsert: true }
    );

    logger.info("Daily campaign create job executed successfully.");
  } catch (error) {
    logger.error(error, "Error executing campaign create job:");
  }
}

export default dailyCampaignJob;
