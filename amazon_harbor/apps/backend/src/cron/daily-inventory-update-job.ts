import ProductModel from "@/models/product.model";
import type { ZuluAssortment } from "@/types/zulu";
import apiZuluInstance from "@/utils/api-zulu-instance";
import logger from "@repo/logger";

async function dailyInventoryUpdateJob() {
  logger.info("Initializing daily inventory update job...");
  try {
    const products = await ProductModel.find();

    const assortments = products
      .map((item) => item.assortmentNumber)
      .filter((item) => item);

    const zuluAssortments = await apiZuluInstance.get<{
      data: ZuluAssortment[];
    }>("/zulu-amazon/assorts-update", {
      params: {
        assorts: JSON.stringify(assortments),
      },
    });

    const reducedData = zuluAssortments.data.data.map(
      ({ item_number: itemNumber, stocks, mops }) => ({
        itemNumber,
        stockQty: Math.max(
          0,
          Math.round(stocks.reduce((total, { qty }) => total + qty, 0))
        ),
        poQuantity: Math.max(
          0,
          Math.round(
            mops.reduce((total, { product_qty: qty }) => total + qty, 0)
          )
        ),
      })
    );

    const bulkOperations = reducedData.map((item) => ({
      updateOne: {
        filter: { assortmentNumber: item.itemNumber }, // Filter to find the document
        update: {
          $set: {
            yiwuWarehouseInventory: item.stockQty,
            poQuantity: item.poQuantity,
          },
        }, // Update operation
        upsert: true, // Upsert option to insert if not found
      },
    }));

    const listingInventories = await ProductModel.bulkWrite(bulkOperations);

    logger.info(
      listingInventories,
      "Daily inventory update job executed successfully."
    );
  } catch (error) {
    logger.error(error, "Error executing daily inventory update job");
  }
}

export default dailyInventoryUpdateJob;
