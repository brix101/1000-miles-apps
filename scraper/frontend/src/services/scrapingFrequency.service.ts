import { QUERY_SCRAPING_FREQUENCY_KEY } from "@/constant/query.constant";
import {
  FrequenciesEntity,
  frequenciesSchema,
} from "@/schema/frequency.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryFrequencies = (
  options?: UseQueryOptions<
    FrequenciesEntity,
    AxiosError,
    FrequenciesEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_SCRAPING_FREQUENCY_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/scraping-frequency");
      return frequenciesSchema.parse({ frequencies: res.data });
    },
    ...options,
  });
};
