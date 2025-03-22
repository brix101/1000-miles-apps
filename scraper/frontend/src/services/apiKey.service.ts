import { QUERY_API_KEYS_KEY } from "@/constant/query.constant";
import { ApikeysEntity, apikeysSchema } from "@/schema/apiKeys.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryApiKeys = (
  options?: UseQueryOptions<
    ApikeysEntity,
    AxiosError,
    ApikeysEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_API_KEYS_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/scraper-api");
      return apikeysSchema.parse({ apikeys: res.data });
    },
    ...options,
  });
};
