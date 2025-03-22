import z from "zod";

export const customerTypeSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const customerTypesSchema = z.object({
  customerTypes: z.array(customerTypeSchema),
});

export type CustomerTypeEntity = z.TypeOf<typeof customerTypeSchema>;
export type CustomerTypesEntity = z.TypeOf<typeof customerTypesSchema>;
