import { getInventorySummaries } from "@/services/amz-inventory.service";
import { getListingsItems } from "@/services/amz-listing.service";
import { getProducts, type ProductStatus } from "@/services/product.service";
import type { NextFunction, Request, Response } from "express";

export const getProcurementsProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brandName = (req.query.brand as string) || "BSCOOL"; // Use the query parameter or default to 'BSCOOL'
    const marketplaceId = (req.query.marketplace as string) || "ATVPDKIKX0DER"; // Use the query parameter or default to 'USA'
    const status = req.query.status as ProductStatus; // Use the query parameter or default to 'All'

    const inventories = await getInventorySummaries(marketplaceId);
    const products = await getProducts(status);

    const listingsItems = await getListingsItems({
      products,
      marketplaceId,
    });

    const items = await Promise.all(
      listingsItems
        .filter((item) => item.brand.toLowerCase() === brandName.toLowerCase())
        .map(async (item) => {
          const inventory = inventories.find((inv) => inv.asin === item.asin);

          // if (inventory) {
          //   const procurement = await getListingItem({
          //     marketplaceIds: marketplaceId,
          //     sku: inventory.sellerSku,
          //   });

          //   return { ...item, inventory, procurement };
          // }

          return { ...item, inventory, procurement: undefined };
        })
    );
    return res.json({ items });
  } catch (error) {
    next(error);
  }
};
