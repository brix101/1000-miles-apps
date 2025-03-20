import { getModulesQuery } from "@/services/module.service";
import { Module } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetModules(
  options?: UseQueryOptions<Module[], AxiosError>
): UseQueryResult<Module[], AxiosError> {
  return useQuery({
    ...getModulesQuery(),
    ...options,
  });
}

export default useGetModules;
