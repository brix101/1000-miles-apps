import { QUERY_KEYS } from "@/constants/query.key";
import { api } from "@/lib/axios-client";
import { MutationConfig } from "@/lib/react-query";
import { AssortmentPCF } from "@/types/assortment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ToastAndroid } from "react-native";

interface DeletePCFImageParams {
  pcfImageId: string;
  assortmentId: string;
}

export function deletePCFImage({ pcfImageId }: DeletePCFImageParams) {
  return api.delete(`/pcf-images/${pcfImageId}`);
}

type MutationFnType = typeof deletePCFImage;

export function useDeletePCFImage(options?: MutationConfig<MutationFnType>) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    onMutate: ({ assortmentId, pcfImageId: itemId }) => {
      const prevState = queryClient.getQueryData([
        QUERY_KEYS.ASSORTMENTS,
        assortmentId,
      ]);

      queryClient.setQueryData<AssortmentPCF>(
        [QUERY_KEYS.ASSORTMENTS, assortmentId],
        (old: AssortmentPCF | undefined) => ({
          ...old!,
          pcfImages: old?.pcfImages.filter((pcf) => pcf._id !== itemId) || [],
        })
      );
      return { prevState };
    },
    onError: (_err, { assortmentId }, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.ASSORTMENTS, assortmentId],
        context?.prevState
      );
    },
    onSuccess: () => {
      ToastAndroid.show(t("keyMessage_imageDeleted"), ToastAndroid.SHORT);
    },
    mutationFn: deletePCFImage,
  });
}
