import BrandModel from "@/models/brand.model";
import { getListingsItems } from "@/services/amz-listing.service";
import { getMarketplaces } from "@/services/marketplace.service";
import { getProducts } from "@/services/product.service";
import logger from "@repo/logger";

async function dailyBrandUpdateJob() {
  logger.info("Initializing brand update cron job...");
  try {
    const marketplaces = await getMarketplaces();
    const products = await getProducts();

    const uniqueBrands = Array.from(
      new Set(
        (
          await Promise.all(
            marketplaces.map(async (marketplace) => {
              const listingsItems = await getListingsItems({
                products,
                marketplaceId: marketplace.marketplaceId,
              });
              return listingsItems.map((item) =>
                item.brand.trim().toLowerCase()
              );
            })
          )
        ).flat()
      )
    );
    // Prepare operations for bulkWrite
    const operations = uniqueBrands.map((brand) => ({
      updateOne: {
        filter: { name: brand },
        update: { name: brand },
        upsert: true,
      },
    }));

    // Perform all operations in one go
    const result = await BrandModel.bulkWrite(operations);

    logger.info(
      `Number of new listings inserted: ${result.insertedCount}`,
      "Brand update job executed successfully."
    );
  } catch (error) {
    logger.error(error, "Error executing daily brand update job");
  }
}

export default dailyBrandUpdateJob;
