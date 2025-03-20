import BrandModel, { type IBrand } from "@/models/brand.model";
import { type FilterQuery } from "mongoose";

/**
 * Retrieves all brands from the database, optionally filtered based on provided criteria.
 * @param filter - Optional. An object containing filtering criteria.
 * @returns A Promise that resolves to an array of BrandDocument objects representing the retrieved brands.
 */
export async function getBrands(filter: FilterQuery<IBrand> = {}) {
  return BrandModel.find(filter).sort({ name: 1 }).lean();
}
