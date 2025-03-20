import { getCompaniesQuery } from "@/services/company.service";
import { Company } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetCompanies(
  options?: UseQueryOptions<Company[], AxiosError>
): UseQueryResult<Company[], AxiosError> {
  return useQuery({
    ...getCompaniesQuery(),
    ...options,
  });
}

export default useGetCompanies;
