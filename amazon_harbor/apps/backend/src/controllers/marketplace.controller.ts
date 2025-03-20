import { getListingsItems } from "@/services/amz-listing.service";
import { getMarketplaces } from "@/services/marketplace.service";
import { getProducts } from "@/services/product.service";
import type { NextFunction, Request, Response } from "express";

export const getMarketplacesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketplaces = await getMarketplaces();

    return res.json({ items: marketplaces });
  } catch (error) {
    next(error);
  }
};

export const getMarketplaceParticipationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketplaces = await getMarketplaces();
    const products = await getProducts();

    const marketplacesSummary = await Promise.all(
      marketplaces.map(async (marketplace) => {
        const listingsItems = await getListingsItems({
          products,
          marketplaceId: marketplace.marketplaceId,
        });

        const { brands, activeItemsCount, inactiveItemsCount } =
          listingsItems.reduce(
            (acc, item) => {
              const attrBrand = item.attributes.brand?.[0].value;
              const brand = attrBrand ? attrBrand.toLowerCase() : null;

              if (brand && !acc.brands.has(brand)) {
                acc.brands.add(brand);
              }

              if (item.status === "Active") {
                acc.activeItemsCount++;
              } else {
                acc.inactiveItemsCount++;
              }

              return acc;
            },
            {
              brands: new Set<string>(),
              activeItemsCount: 0,
              inactiveItemsCount: 0,
            }
          );

        return {
          ...marketplace,
          brands: Array.from(brands),
          activeItemsCount,
          inactiveItemsCount,
        };
      })
    );

    return res.json({ items: marketplacesSummary });
  } catch (error) {
    next(error);
  }
};
