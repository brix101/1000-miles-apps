import {
  BrandEntryDTO,
  ListingProductDTO,
  MarkerplaceExtendEntryDTO,
} from "@repo/schema";

export interface ListingBrand extends BrandEntryDTO {
  marketplaces: MarkerplaceExtendEntryDTO[];
  products: ListingProductDTO[];
  activeProducts: ListingProductDTO[];
  inActiveProducts: ListingProductDTO[];
}

export interface ListingBrands {
  items: ListingBrand[];
}
