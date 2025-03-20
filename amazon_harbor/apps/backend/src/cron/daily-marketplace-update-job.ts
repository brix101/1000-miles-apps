import MarketplaceModel, { MarketplaceInput } from "@/models/marketplace.model";
import { getMarketplaceParticipations } from "@/services/amz-marketplace.service";
import logger from "@repo/logger";

async function dailyMarketplaceUpdateJob() {
  logger.info("Initializing marketplace update cron job...");
  try {
    const marketplaces = await getMarketplaceParticipations();

    const reducedSellerMarketplaces = marketplaces.reduce((acc, curr) => {
      if (!acc[curr.id]) {
        acc[curr.id] = {
          ...curr,
          marketplaceId: curr.id,
          sellersAccounts: [],
        };
      }
      acc[curr.id].sellersAccounts.push(curr.sellersAccount);
      return acc;
    }, {} as MarketplaceInput);

    const bulkOperations = Object.values(reducedSellerMarketplaces).map(
      (item) => ({
        updateOne: {
          filter: { marketplaceId: item.marketplaceId },
          update: {
            $set: item,
          },
          upsert: true,
        },
      })
    );

    const upsertResult = await MarketplaceModel.bulkWrite(bulkOperations);

    logger.info(upsertResult, "Marketplace update job executed successfully.");
  } catch (error) {
    logger.error(error, "Error executing daily marketplace update job:");
  }
}

export default dailyMarketplaceUpdateJob;
