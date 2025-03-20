export interface MarketplaceEntry {
  marketplaceId: string;
  country: string;
  countryCode: string;
  region: string;
}

export interface Marketplace {
  id: string;
  countryCode: string;
  name: string;
  defaultCurrencyCode: string;
  defaultLanguageCode: string;
  domainName: string;
}
export interface MarketplaceParticipationList {
  marketplace: Marketplace;
  participation: {
    isParticipating: boolean;
    hasSuspendedListings: boolean;
  };
}

export interface MarketplaceParticipation extends Marketplace {
  country: string;
  sellersAccount: string;
}
