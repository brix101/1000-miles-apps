import ModuleModel, { type IModule } from "@/models/module.model";
import { type FilterQuery } from "mongoose";

/**
 * Retrieves all modules from the database, optionally filtered based on provided criteria.
 * @param filter - Optional. An object containing filtering criteria based on the IModule schema.
 * @returns A Promise that resolves to an array of module documents sorted by name in ascending order.
 */
export async function getModules(filter: FilterQuery<IModule> = {}) {
  return ModuleModel.find(filter).sort({ name: 1 });
}
