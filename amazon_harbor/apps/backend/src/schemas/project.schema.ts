import * as z from "zod";

export const getProductSchema = z.object({
  params: z.object({
    asin: z.string({
      required_error: "id is required",
    }),
  }),
});

export type GetProductDTO = z.TypeOf<typeof getProductSchema>;
