import { QUERY_COUNTRIES_KEY } from "@/constant/query.constant";
import { CountriesEntity, countriesSchema } from "@/schema/country.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryCountries = (
  options?: UseQueryOptions<
    CountriesEntity,
    AxiosError,
    CountriesEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_COUNTRIES_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/countries");
      return countriesSchema.parse({ countries: res.data });
    },
    ...options,
  });
};
