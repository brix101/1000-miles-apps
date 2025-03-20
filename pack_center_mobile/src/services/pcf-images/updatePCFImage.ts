import { api } from "@/lib/axios-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const updatePCFImageSchema = z.object({
  _id: z.string(),
  assortmentId: z.string(),
  barcodeErrors: z.array(z.string()),
});

export type UpdatePCFImageDTO = z.infer<typeof updatePCFImageSchema>;

export function updatePCFImageStatus({
  _id,
  assortmentId,
  ...data
}: UpdatePCFImageDTO) {
  return api.patch(`/pcf-images/${_id}`, data);
}

type MutationFnType = typeof updatePCFImageStatus;

export function useUpdatePCFImage(options?: MutationConfig<MutationFnType>) {
  // const queryClient = useQueryClient();
  return useMutation({
    ...options,
    // onMutate: async ({ _id, assortmentId, barcodeErrors }) => {
    //   const prevAssortment = queryClient.getQueryData<AssortmentPCF>([
    //     QUERY_KEYS.ASSORTMENTS,
    //     assortmentId,
    //   ]);

    //   queryClient.setQueryData<AssortmentPCF>(
    //     [QUERY_KEYS.ASSORTMENTS, assortmentId],
    //     (prev) =>
    //       ({
    //         ...prev,
    //         pcfImages: prev?.pcfImages.map((pcfImage) => {
    //           if (pcfImage._id === _id) {
    //             return {
    //               ...pcfImage,
    //               barcodeErrors,
    //             };
    //           }
    //           return pcfImage;
    //         }),
    //       } as AssortmentPCF)
    //   );

    //   return { prevAssortment };
    // },
    // onError: (_error, variables, context) => {
    //   queryClient.setQueryData(
    //     [QUERY_KEYS.ASSORTMENTS, variables.assortmentId],
    //     context?.prevAssortment
    //   );
    // },
    mutationFn: updatePCFImageStatus,
  });
}
