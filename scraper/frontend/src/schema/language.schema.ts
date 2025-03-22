import z from "zod";

export const languageSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    code: z.string(),
    active: z.boolean(),
    default: z.boolean().nullish(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const languagesSchema = z.object({
  languages: z.array(languageSchema),
});

export type LanguageEntity = z.TypeOf<typeof languageSchema>;
export type LanguagesEntity = z.TypeOf<typeof languagesSchema>;
