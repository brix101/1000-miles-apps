import type {
  MarketplaceEntry,
  MarketplaceParticipation,
  MarketplaceParticipationList,
} from "@/types/marketplace";
import { apiInstance } from "@/utils/api-instance";
import { getCompaniesToken } from "./company.service";

// Define the marketplace data interface

export function getAMZMarketplaces(): MarketplaceEntry[] {
  return [
    {
      marketplaceId: "A2EUQ1WTGCTBG2",
      country: "Canada",
      countryCode: "CA",
      region: "NorthAmerica",
    },
    {
      marketplaceId: "ATVPDKIKX0DER",
      country: "USA",
      // country: "United States of America",
      countryCode: "US",
      region: "NorthAmerica",
    },
    {
      marketplaceId: "A1AM78C64UM0Y8",
      country: "Mexico",
      countryCode: "MX",
      region: "NorthAmerica",
    },
    {
      marketplaceId: "A2Q3Y263D00KWC",
      country: "Brazil",
      countryCode: "BR",
      region: "NorthAmerica",
    },
    {
      marketplaceId: "A1RKKUPIHCS9HS",
      country: "Spain",
      countryCode: "ES",
      region: "Europe",
    },
    {
      marketplaceId: "A1F83G8C2ARO7P",
      country: "United Kingdom",
      countryCode: "UK",
      region: "Europe",
    },
    {
      marketplaceId: "A13V1IB3VIYZZH",
      country: "France",
      countryCode: "FR",
      region: "Europe",
    },
    {
      marketplaceId: "AMEN7PMS3EDWL",
      country: "Belgium",
      countryCode: "BE",
      region: "Europe",
    },
    {
      marketplaceId: "A1805IZSGTT6HS",
      country: "Netherlands",
      countryCode: "NL",
      region: "Europe",
    },
    {
      marketplaceId: "A1PA6795UKMFR9",
      country: "Germany",
      countryCode: "DE",
      region: "Europe",
    },
    {
      marketplaceId: "APJ6JRA9NG5V4",
      country: "Italy",
      countryCode: "IT",
      region: "Europe",
    },
    {
      marketplaceId: "A2NODRKZP88ZB9",
      country: "Sweden",
      countryCode: "SE",
      region: "Europe",
    },
    {
      marketplaceId: "AE08WJ6YKNBMC",
      country: "South Africa",
      countryCode: "ZA",
      region: "Europe",
    },
    {
      marketplaceId: "A1C3SOZRARQ6R3",
      country: "Poland",
      countryCode: "PL",
      region: "Europe",
    },
    {
      marketplaceId: "ARBP9OOSHTCHU",
      country: "Egypt",
      countryCode: "EG",
      region: "Europe",
    },
    {
      marketplaceId: "A33AVAJ2PDY3EV",
      country: "Turkey",
      countryCode: "TR",
      region: "Europe",
    },
    {
      marketplaceId: "A17E79C6D8DWNP",
      country: "Saudi Arabia",
      countryCode: "SA",
      region: "Europe",
    },
    {
      marketplaceId: "A2VIGQ35RCS4UG",
      country: "United Arab Emirates",
      countryCode: "AE",
      region: "Europe",
    },
    {
      marketplaceId: "A21TJRUUN4KGV",
      country: "India",
      countryCode: "IN",
      region: "Europe",
    },
    {
      marketplaceId: "A19VAU5U5O7RUS",
      country: "Singapore",
      countryCode: "SG",
      region: "FarEast",
    },
    {
      marketplaceId: "A39IBJ37TRP1C6",
      country: "Australia",
      countryCode: "AU",
      region: "FarEast",
    },
    {
      marketplaceId: "A1VC38T7YXB528",
      country: "Japan",
      countryCode: "JP",
      region: "FarEast",
    },
  ];
}

/**
 * Filters the list of Amazon marketplaces based on the provided criteria.
 *
 * @param filter - An object containing key-value pairs to filter the marketplaces.
 * @returns  MarketplaceEntry | undefined - The first marketplace entry that matches all the filter criteria, or undefined if no match is found.
 *
 * This function retrieves the list of Amazon marketplaces using `getAMZMarketplaces` and then searches for an entry that matches all the key-value pairs specified in the `filter` object. It returns the first matching entry or undefined if no match is found.
 */
export function filterByMarketplace(
  filter: Partial<MarketplaceEntry>
): MarketplaceEntry | undefined {
  const AMZMarketplaces = getAMZMarketplaces();

  return AMZMarketplaces.find((entry) =>
    Object.entries(filter).every(
      ([key, value]) => entry[key as keyof MarketplaceEntry] === value
    )
  );
}

/**
 * Retrieves marketplace participation data from the Selling Partner API.
 * This function fetches data on the marketplaces in which the seller is participating.
 * It filters the data based on certain criteria and maps it to a standardized format.
 * @returns A promise that resolves to an array of MarketplaceParticipation objects representing the seller's participation in various marketplaces.
 */
export async function getMarketplaceParticipations(): Promise<
  MarketplaceParticipation[]
> {
  const companies = await getCompaniesToken();

  const results = await Promise.all(
    companies.map(async (company) => {
      // If not in the cache, fetch data from the API
      const response = await apiInstance.get<{
        payload: MarketplaceParticipationList[];
      }>("/sellers/v1/marketplaceParticipations", {
        headers: {
          "x-amz-access-token": company.lwa.accessToken,
        },
        params: {},
      });

      // Process and filter data
      return response.data.payload
        .filter(({ marketplace }) =>
          filterByMarketplace({ marketplaceId: marketplace.id })
        )
        .map(({ marketplace }) => {
          const item = filterByMarketplace({
            marketplaceId: marketplace.id,
          });
          return {
            ...marketplace,
            country: item?.country || "",
            sellersAccount: company.name,
          };
        });
    })
  );

  return results.flat();
}
