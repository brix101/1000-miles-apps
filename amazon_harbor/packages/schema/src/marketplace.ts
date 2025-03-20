import * as z from "zod";

export const markerplaceEntrySChema = z.object({
  _id: z.string(),
  marketplaceId: z.string(),
  countryCode: z.string(),
  name: z.string(),
  defaultCurrencyCode: z.string(),
  defaultLanguageCode: z.string(),
  domainName: z.string(),
});

export type MarkerplaceEntryDTO = z.infer<typeof markerplaceEntrySChema>;

export const markerplaceExtendedEntrySChema = markerplaceEntrySChema.extend({
  country: z.string(),
  sellersAccount: z.string().nullish(),
  selersAccounts: z.array(z.string()).nullish(),
});

export type MarkerplaceExtendEntryDTO = z.infer<
  typeof markerplaceExtendedEntrySChema
>;

export interface MarketPlaceWithBrand extends MarkerplaceExtendEntryDTO {
  brand: string[];
  activeItemsCount?: number;
  inactiveItemsCount?: number;
}

export const markerplacesExtendedEntrySChema = z.object({
  items: z.array(markerplaceExtendedEntrySChema),
});

export interface MarkerplacesExtendEntryDTO {
  items: MarketPlaceWithBrand[];
}
