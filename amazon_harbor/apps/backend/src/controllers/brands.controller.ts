import { getListingsItems } from "@/services/amz-listing.service";
import { getBrands } from "@/services/brand.service";
import { getMarketplaces } from "@/services/marketplace.service";
import { getProducts } from "@/services/product.service";
import type { NextFunction, Request, Response } from "express";

export const getAllBrandsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await getBrands();

    return res.json({ items: brands });
  } catch (error) {
    next(error);
  }
};

export const getAllBrandsMarketplacesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await getBrands();
    const marketplaces = await getMarketplaces();
    const products = await getProducts();

    const marketplaceListings = await Promise.all(
      marketplaces.map(async (marketplace) => {
        const listings = await getListingsItems({
          products,
          marketplaceId: marketplace.marketplaceId,
        });

        return {
          marketplace,
          listings,
        };
      })
    );

    const items = brands.map((brand) => {
      const brandMarketplaces = marketplaceListings
        .map(({ listings, ...rest }) => ({
          ...rest,
          listings: listings.filter(
            (item) => item.brand.toLowerCase() === brand.name.toLowerCase()
          ),
        }))
        .filter(({ listings }) => listings.length > 0);

      const asinStatusRecord = brandMarketplaces
        .flatMap(({ listings }) => listings)
        .reduce<Record<string, string>>((map, item) => {
          map[item.asin] = item.status;
          return map;
        }, {});

      const statusCounts = Object.values(asinStatusRecord).reduce(
        (acc, status) => {
          if (status === "Active") {
            acc.activeItemsCount++;
          } else {
            acc.inactiveItemsCount++;
          }
          return acc;
        },
        { activeItemsCount: 0, inactiveItemsCount: 0 }
      );

      return {
        ...brand,
        ...statusCounts,
        marketplaces: brandMarketplaces.map(({ marketplace }) => marketplace),
      };
    });

    return res.json({ items });
  } catch (error) {
    next(error);
  }
};
