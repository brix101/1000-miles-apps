import MarketplaceModel, {
  type IMarketplace,
} from "@/models/marketplace.model";
import { type FilterQuery } from "mongoose";

/**
 * Retrieves marketplace participations from the database, optionally filtered based on provided criteria.
 * @param filter - Optional. An object containing filtering criteria based on the IMarketplace schema.
 * @returns A Promise that resolves to an array of lean marketplace documents.
 */
export async function getMarketplaces(filter: FilterQuery<IMarketplace> = {}) {
  return MarketplaceModel.find(filter).sort({ country: 1 }).lean();
}
