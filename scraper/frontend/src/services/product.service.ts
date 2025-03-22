import {
  QUERY_CATEGORIES_SCORE_KEY,
  QUERY_TAGS_SCORE_KEY,
} from "@/constant/query.constant";
import { ScoresEntity, scoresSchema } from "@/schema/product.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryTagsScore = (
  options?: UseQueryOptions<
    ScoresEntity,
    AxiosError,
    ScoresEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_TAGS_SCORE_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/products/tags-score");
      return scoresSchema.parse({ scores: res.data });
    },
    ...options,
  });
};

export const useQueryCategoriesScore = (
  options?: UseQueryOptions<
    ScoresEntity,
    AxiosError,
    ScoresEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_CATEGORIES_SCORE_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/products/categories-score");
      return scoresSchema.parse({ scores: res.data });
    },
    ...options,
  });
};
