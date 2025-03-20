import { api } from "@/lib/axios-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";

export const imageAsset = z.object({
  uri: z.string(),
  type: z.string(),
  name: z.string(),
});

export type ImageAsset = z.infer<typeof imageAsset>;

export const uploadImageSchema = z.object({
  masterUccLabel: imageAsset.optional(),
  masterShippingMark: imageAsset.optional(),
  masterCarton: imageAsset.optional(),
  innerItemLabel: imageAsset.optional(),
  innerUccLabel: imageAsset.optional(),
  innerItemUccLabel: imageAsset.optional(),
  innerCarton: imageAsset.optional(),
  upcLabelFront: imageAsset.optional(),
  upcLabelBack: imageAsset.optional(),
  upcPlacement: z.array(imageAsset).optional(),
  productPictures: z.array(imageAsset).optional(),
  protectivePackaging: z.array(imageAsset).optional(),
  masterUccErrors: z.string().optional(),
  innerUccErrors: z.string().optional(),
});

export type UploadImageDTO = z.infer<typeof uploadImageSchema>;

export const uploadAssortmentImageSchema = uploadImageSchema.extend({
  _id: z.string(),
});

export type UploadAssortmentImageDTO = z.infer<
  typeof uploadAssortmentImageSchema
>;

export async function uploadAssormentImage({
  _id,
  ...data
}: UploadAssortmentImageDTO) {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof UploadImageDTO];
    if (value instanceof File || typeof value === "string") {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((file) => {
        if (typeof file === "string") {
          formData.append(key, file);
        } else {
          formData.append(key, file as unknown as string | Blob);
        }
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as unknown as string | Blob);
    }
  });

  const res = await api.patch(`/zulu-assortments/${_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
type MutationFnType = typeof uploadAssormentImage;

export function useUploadAssortmentImage(
  options?: MutationConfig<MutationFnType>
) {
  return useMutation({
    ...options,
    mutationFn: uploadAssormentImage,
  });
}
