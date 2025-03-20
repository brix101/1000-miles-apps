import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

import { QUERY_KEYS } from "@/constants/query.key";
import { api } from "@/lib/axios-client";
import { MutationConfig } from "@/lib/react-query";
import { AssortmentPCF } from "@/types/assortment";

export const editAssormentSchema = z.object({
  _id: z.string(),
  itemInCarton: z.coerce.number().optional(),
  itemPerUnit: z.coerce.number().optional(),
  unit: z.string().optional(),
});

export type EditAssortmentDTO = z.infer<typeof editAssormentSchema>;

export async function editAssortment(data: EditAssortmentDTO) {
  return api.post<AssortmentPCF>(`/zulu-assortments/${data._id}`, data, {});
}

type MutationFnType = typeof editAssortment;

export function useEditAssortment(options?: MutationConfig<MutationFnType>) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    onMutate: async (variable) => {
      const queryKey = [QUERY_KEYS.ASSORTMENTS, variable._id];

      await queryClient.cancelQueries({ queryKey });
      const prevAssortment = queryClient.getQueryData(queryKey);
      queryClient.setQueryData<AssortmentPCF>(
        queryKey,
        (prev) =>
          ({
            ...prev,
            ...variable,
          } as AssortmentPCF)
      );

      return { prevAssortment };
    },
    onSuccess: (res) => {
      if (res) {
        queryClient.setQueryData<AssortmentPCF>(
          [QUERY_KEYS.ASSORTMENTS, res.data._id],
          (prev) => ({
            ...prev,
            ...res.data,
            pcfImages: prev?.pcfImages || res.data.pcfImages,
          })
        );
      }
    },
    onError: (_err, variable, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.ASSORTMENTS, variable._id],
        context?.prevAssortment
      );
    },
    mutationFn: editAssortment,
  });
}
