import { ServerError } from '@/types/error';
import {
  DefaultOptions,
  QueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryConfig: DefaultOptions = {
  queries: {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError<ServerError>,
    Parameters<MutationFnType>[0] | void
  >;
