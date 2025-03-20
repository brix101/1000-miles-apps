import { ServerError } from "@/types/error";
import {
  DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { log } from "./logger";

const queryConfig: DefaultOptions = {
  queries: {
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  queryCache: new QueryCache({
    onError: (error) => {
      log.error(
        `An error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      log.error(
        `An error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  }),
});

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError<ServerError>,
    Parameters<MutationFnType>[0] | void
  >;
