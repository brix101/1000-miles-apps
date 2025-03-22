import z from "zod";

export const excludedWordSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    word: z.string().nullish(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export type ExludedWordEntity = z.TypeOf<typeof excludedWordSchema>;

export const excludedWordsSchema = z.object({
  words: z.array(excludedWordSchema),
});
export type ExludedWordsEntity = z.TypeOf<typeof excludedWordsSchema>;

export const addExludedWordSchema = z.object({
  words: z
    .string()
    .nonempty({ message: "Word Must Contain At Least 1 Character(S)" })
    .transform((value) => value.split(",").map((item) => item.trim())),
});
export type AddExcludedWordInput = z.TypeOf<typeof addExludedWordSchema>;

export const removeExludedWordSchema = z.object({
  id: z.string(),
});
export type RemoveExcludedWordInput = z.TypeOf<typeof removeExludedWordSchema>;
