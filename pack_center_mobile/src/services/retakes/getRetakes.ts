import { QUERY_KEYS } from "@/constants/query.key";
import { api } from "@/lib/axios-client";
import { QueryConfig } from "@/lib/react-query";
import { Retake } from "@/types/retakes";
import { useQuery } from "@tanstack/react-query";

export async function getRetakes() {
  const res = await api.get<Retake[]>("/retakes");

  return res.data;
}

export function getRetakesQuery() {
  return {
    queryKey: [QUERY_KEYS.RETAKES],
    queryFn: getRetakes,
  };
}

type QueryFnType = typeof getRetakes;

export function useGetRetakes(options?: QueryConfig<QueryFnType>) {
  return useQuery({
    ...options,
    ...getRetakesQuery(),
    staleTime: Infinity,
  });
}
