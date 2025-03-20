// eslint-disable-next-line import/no-extraneous-dependencies
import * as cron from "node-cron";

import dailyBrandUpdateJob from "./daily-brand-update-job";
import dailyCampaignJob from "./daily-campaign-job";
import dailyInventoryUpdateJob from "./daily-inventory-update-job";
import dailyListingUpdateJob from "./daily-listing-update-job";
import dailyMarketplaceUpdateJob from "./daily-marketplace-update-job";
import dailySalesTrafficJob from "./daily-sales-traffic-job";

function initializeCron() {
  // Schedule daily report job
  // void hourlyRefreshAccessToken(); // Run the first job immediately
  // cron.schedule("*/55 * * * *", hourlyRefreshAccessToken); // Schedule the first job to run every 5 minutes

  cron.schedule("0 0 * * *", dailyListingUpdateJob); // Run dailyReportJob every day at midnight
  cron.schedule("0 0 * * *", dailyBrandUpdateJob);
  cron.schedule("0 0 * * *", dailySalesTrafficJob);
  cron.schedule("0 0 * * *", dailyMarketplaceUpdateJob);
  cron.schedule("0 0 * * *", dailyCampaignJob);
  cron.schedule("0 0 * * *", dailyInventoryUpdateJob);
  // cron.schedule("10 0 * * *", dailySalesTrafficUpdateJob); // Schedule the second job to run at 10 minutes past midnight every day
}

export default initializeCron;
