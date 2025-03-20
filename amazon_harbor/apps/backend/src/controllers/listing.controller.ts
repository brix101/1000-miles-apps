import { getInventorySummaries } from "@/services/amz-inventory.service";
import { getListingsItems } from "@/services/amz-listing.service";
import { getProducts, type ProductStatus } from "@/services/product.service";
import type { NextFunction, Request, Response } from "express";

export const getListingsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProducts();

    return res.json({ items: products });
  } catch (error) {
    next(error);
  }
};

export const getListingsProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brandName = (req.query.brand as string) || "BSCOOL"; // Use the query parameter or default to 'BSCOOL'
    const status = req.query.status as ProductStatus; // Use the query parameter or default to 'All'

    const products = await getProducts(status);
    const inventorySummaries = await getInventorySummaries("ATVPDKIKX0DER");

    const listingsItems = await getListingsItems({
      products,
    });

    const items = listingsItems
      .filter((item) => item.brand.toLowerCase() === brandName.toLowerCase())
      .map((item) => {
        const inventory = inventorySummaries.find(
          (inv) => inv.asin === item.asin
        );
        return { ...item, inventory };
      });

    return res.json({ items });
  } catch (error) {
    next(error);
  }
};
