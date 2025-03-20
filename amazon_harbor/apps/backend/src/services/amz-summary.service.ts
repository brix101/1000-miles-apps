import ReportModel from "@/models/report.model";
import apiSPInstance from "@/utils/api-sp-instance";
import { getProducts } from "./product.service";

export interface ListingPrice {
  amount: number;
  currencyCode: string;
}

export interface CompetitiveSummary {
  asin: string;
  marketplaceId: string;
  listingPrice: ListingPrice;
}

interface CompetitiveSummaryBatchResponse {
  responses: [
    {
      body: {
        asin: string;
        marketplaceId: string;
        featuredBuyingOptions: [
          {
            segmentedFeaturedOffers: [
              {
                listingPrice: ListingPrice;
              },
            ];
          },
        ];
      };
    },
  ];
}

interface FetchWrapperProps {
  chunkedAsins: string[];
  marketplaceId: string;
}

export async function getCompetitiveSummary() {
  const report = await ReportModel.findOne({
    type: "ListingPrice",
  })
    .sort({ createdAt: -1 })
    .exec();

  const data = report?.data || "[]";

  const parsedItems = JSON.parse(data) as CompetitiveSummary[];

  return parsedItems;
}

export async function updateCompetitiveSummary() {
  const marketplaces = [
    {
      marketplaceId: "ATVPDKIKX0DER",
    },
  ];

  const timeoutDuration = 1000; // 1 second
  const maxSize = 20;
  const products = await getProducts();

  const slicedListins = Array.from(
    { length: Math.ceil(products.length / maxSize) },
    (_, i) => {
      const start = i * maxSize;
      const end = start + maxSize;
      return products.slice(start, end).map((item) => item.asin);
    }
  ).filter((asins) => asins.length > 0);

  async function fetchData({
    chunkedAsins,
    marketplaceId,
  }: FetchWrapperProps): Promise<CompetitiveSummary[]> {
    const response = await apiSPInstance.post<CompetitiveSummaryBatchResponse>(
      "/batches/products/pricing/2022-05-01/items/competitiveSummary",
      {
        requests: chunkedAsins.map((asin) => {
          return {
            asin,
            marketplaceId,
            includedData: ["featuredBuyingOptions"],
            uri: "/products/pricing/2022-05-01/items/competitiveSummary",
            method: "GET",
          };
        }),
      }
    );

    const defaultListingPrice = {
      amount: 0,
      currencyCode: "USD",
    };

    const items = response.data.responses.map(
      ({ body: { asin, featuredBuyingOptions } }) => {
        const { segmentedFeaturedOffers } = featuredBuyingOptions[0];
        const { listingPrice = defaultListingPrice } =
          segmentedFeaturedOffers[0];

        return {
          asin,
          marketplaceId,
          listingPrice,
        };
      }
    );

    return items;
  }

  async function timeoutWrapper(
    props: FetchWrapperProps
  ): Promise<CompetitiveSummary[]> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await fetchData(props);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, timeoutDuration);
    });
  }

  const fetchDataPromises = marketplaces.map(async ({ marketplaceId }) => {
    const promises = slicedListins.map((slice) =>
      timeoutWrapper({ chunkedAsins: slice, marketplaceId })
    );

    return (await Promise.all(promises)).flat();
  });

  // Wait for all promises to resolve
  const responses = (await Promise.all(fetchDataPromises)).flat();

  return responses;
}
