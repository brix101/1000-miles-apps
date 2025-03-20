import { InventorySummaries } from ".";

export interface Attribute {
  language_tag: string;
  value: string;
  marketplace_id: string;
}

export interface AttributePrice {
  currency: string;
  value: number;
  marketplace_id: string;
}

export interface Image {
  marketplaceId: string;
  images: {
    variant: string;
    link: string;
    height: number;
    width: number;
  }[];
}

export interface Summary {
  marketplaceId: string;
  adultProduct: boolean;
  autographed: boolean;
  brand: string;
  browseClassification: {
    displayName: string;
    classificationId: string;
  };
  itemClassification: string;
  itemName: string;
  manufacturer: string;
  memorabilia: boolean;
  modelNumber: string;
  partNumber: string;
  tradeInEligible: boolean;
  websiteDisplayGroup: string;
  websiteDisplayGroupName: string;
}

export interface ItemPackageWeight {
  marketplace_id: string;
  unit: string;
  value: number;
}

export interface Attributes {
  item_type_name?: Attribute[];
  item_package_weight?: ItemPackageWeight[];
  manufacturer?: Attribute[];
  externally_assigned_product_identifier?: Attribute[];
  model_name?: Attribute[];
  age_range_description?: Attribute[];
  recommended_browse_nodes?: Attribute[];
  bullet_point?: Attribute[];
  item_dimensions?: Attribute[];
  theme?: Attribute[];
  model_number?: Attribute[];
  product_description?: Attribute[];
  brand?: Attribute[];
  is_expiration_dated_product?: Attribute[];
  seasons?: Attribute[];
  item_name?: Attribute[];
  batteries_required?: Attribute[];
  product_site_launch_date?: Attribute[];
  number_of_items?: Attribute[];
  item_package_dimensions?: Attribute[];
  target_audience_keyword?: Attribute[];
  material?: Attribute[];
  part_number?: Attribute[];
  batteries_included?: Attribute[];
  target_gender?: Attribute[];
  list_price?: AttributePrice[];
}

export interface ListingProductDTO {
  asin: string;
  attributes: Attributes;
  images: Image[];
  summaries: Summary[];
  salesRanks: SalesRank[];
}

interface ClassificationRank {
  classificationId: string;
  title: string;
  link: string;
  rank: number;
}

interface DisplayGroupRank {
  websiteDisplayGroup: string;
  title: string;
  link: string;
  rank: number;
}

interface SalesRank {
  marketplaceId: string;
  classificationRanks: ClassificationRank[];
  displayGroupRanks: DisplayGroupRank[];
}

export interface ListingProductSummary extends Summary, ListingProductDTO {
  inventory?: InventorySummaries;
  sellerSku: string;
  status: string;
  assortmentNumber?: string;
  price: number;
  weight: number;
}

export interface ZuluItem {
  item_number: string;
  category: string;
  sub_category: string;
  id: number;
  name: string;
}
