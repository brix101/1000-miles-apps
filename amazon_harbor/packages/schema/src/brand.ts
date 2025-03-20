import * as z from "zod";
import { MarkerplaceEntryDTO } from ".";

export const brandEntrySChema = z.object({
  id: z.number(),
  name: z.string(),
});

export const brandsEntrySChema = z.object({
  items: z.array(brandEntrySChema),
});

export type BrandEntryDTO = z.infer<typeof brandEntrySChema>;
export type BrandsEntryDTO = z.infer<typeof brandsEntrySChema>;

export interface BrandWithMarketplaces extends BrandEntryDTO {
  marketplaces: MarkerplaceEntryDTO[];
  activeItemsCount?: number;
  inactiveItemsCount?: number;
}
