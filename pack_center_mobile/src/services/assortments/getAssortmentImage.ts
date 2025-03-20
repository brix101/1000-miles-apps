import { QUERY_KEYS } from "@/constants/query.key";
import { api } from "@/lib/axios-client";
import { QueryConfig } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";

export async function getAssortmentImage(filename: string) {
  const response = await api.get(`/files/static/${filename}`, {
    responseType: "blob",
  });

  const objectURL = URL.createObjectURL(response.data);
  return objectURL;
}

type ParamFnType = Parameters<typeof getAssortmentImage>[0];
type QueryFnType = typeof getAssortmentImage;

export const getAssortmentQuery = (param: ParamFnType) => ({
  queryKey: [QUERY_KEYS.ASSORTMENTS, "image", param],
  queryFn: () => getAssortmentImage(param),
});

export function useGetAssortment(
  param: ParamFnType,
  options?: QueryConfig<QueryFnType>
) {
  return useQuery({
    ...options,
    enabled: param !== "",
    ...getAssortmentQuery(param),
  });
}
