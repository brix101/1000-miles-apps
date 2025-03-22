import { QUERY_CLUSTER_KEY, QUERY_FACETS_KEY } from "@/constant/query.constant";
import { IFacets } from "@/schema/facets.schema";
import { ProductEntity, productsSchema } from "@/schema/product.schema";
import { batchProductIndex } from "@/utils/batchSearch";
import { productIndex } from "@/utils/searchClient";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryFacets = (
  options?: UseQueryOptions<IFacets, AxiosError, IFacets, readonly [string]>
) => {
  const initialFacets: IFacets = {
    tags: [],
    customer_name: [],
    "scraper_categories.name": [],
  };
  const facetNames: Array<string> = Object.keys(initialFacets);

  return useQuery({
    queryKey: [QUERY_FACETS_KEY],
    queryFn: async function () {
      const searchParams = {
        query: "",
        facets: facetNames,
        hitsPerPage: 0,
        maxValuesPerFacet: 5000,
      };
      const response = await productIndex.search("", searchParams);
      for (const facetName in response.facets) {
        if (Object.hasOwnProperty.call(response.facets, facetName)) {
          const facetItems = Object.keys(response.facets[facetName]);
          const arrName = facetName as keyof IFacets;
          const sortedFacetItems = facetItems.sort();

          initialFacets[arrName] = sortedFacetItems;
        }
      }

      return initialFacets;
    },
    ...options,
  });
};

export const useQueryFacetCluster = ({
  clusterId,
  filters,
}: {
  clusterId: string;
  filters: string;
}) => {
  return useQuery({
    queryKey: [QUERY_FACETS_KEY, QUERY_CLUSTER_KEY, clusterId],
    queryFn: async function () {
      const searchParams = {
        facets: [],
        filters: `${filters}`,
      };

      const response = await productIndex.search("", searchParams);

      return response;
    },
  });
};

export const useQueryFacetBatchSearch = ({
  clusterId,
  filters,
}: {
  clusterId: string;
  filters: string;
}) => {
  return useQuery({
    queryKey: [QUERY_FACETS_KEY, QUERY_CLUSTER_KEY, "batch", clusterId],
    queryFn: async () => {
      let hits: ProductEntity[] = [];

      await batchProductIndex.browseObjects({
        filters: filters,
        batch: (batch) => {
          const { products } = productsSchema.parse({ products: batch });

          hits = hits.concat(products);
        },
      });

      return hits;
    },
    refetchOnWindowFocus: false,
  });
};
