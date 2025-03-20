import ProductModel, { type IProduct } from "@/models/product.model";
import type { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";

export type ProductStatus = "All" | "Active" | "Inactive" | "Incomplete";

/**
 * Retrieves a list of products optionally filtered by status.
 * @param status - Optional. Specifies the status by which to filter the products. Defaults to "All".
 * @returns A Promise that resolves to an array of Product documents.
 */
export async function getProducts(status: ProductStatus = "All") {
  const filter: FilterQuery<IProduct> = {};
  if (status !== "All") {
    filter.status = status === "Active" ? "Active" : { $ne: "Active" };
  }
  return ProductModel.find(filter).lean();
}

/**
 * Finds a product in the database based on the provided query.
 * @param query - The query to find the product.
 * @param options - Optional. Additional options for the find operation. Defaults to { lean: true }.
 * @returns A Promise that resolves to the found Product document.
 */
export async function findProduct(
  query: FilterQuery<IProduct>,
  options: QueryOptions = { lean: true }
) {
  return ProductModel.findOne(query, {}, options);
}

/**
 * Updates a product in the database based on the provided query and update.
 *
 * @param query - The query to find the product(s) to update.
 * @param update - The update to apply to the product(s) found by the query.
 * @param options - Optional. Additional options for the update operation. Defaults to { new: true }.
 * @returns A Promise that resolves to the updated Product document.
 */
export async function updateProduct(
  query: FilterQuery<IProduct>,
  update: UpdateQuery<IProduct>,
  options: QueryOptions
) {
  return ProductModel.findOneAndUpdate(query, update, options);
}
