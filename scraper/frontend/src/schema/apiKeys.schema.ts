import z from "zod";

export const apikeySchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    key: z.string(),
    code: z.string(),
    translation: z.boolean(),
    search: z.boolean(),
    note: z.string().nullish(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const apikeysSchema = z.object({
  apikeys: z.array(apikeySchema),
});

export type ApikeyEntity = z.TypeOf<typeof apikeySchema>;
export type ApikeysEntity = z.TypeOf<typeof apikeysSchema>;
