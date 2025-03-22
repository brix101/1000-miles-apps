import { QUERY_LANGUAGES_KEY } from "@/constant/query.constant";
import { LanguagesEntity, languagesSchema } from "@/schema/language.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryLanguges = (
  options?: UseQueryOptions<
    LanguagesEntity,
    AxiosError,
    LanguagesEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_LANGUAGES_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/languages");
      return languagesSchema.parse({ languages: res.data });
    },
    ...options,
  });
};
