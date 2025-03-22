import z from "zod";
import { languageSchema } from "./language.schema";

export const wordSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    word: z.string().nullish(),
    language: languageSchema,
    synonyms: z.array(z.string()),
    plural: z.array(z.string()),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export type WordEntity = z.TypeOf<typeof wordSchema>;

export const wordsSchema = z.object({
  words: z.array(wordSchema),
});
export type WordsEntity = z.TypeOf<typeof wordsSchema>;

export const addSynonymsSchema = z.object({
  id: z.string(),
  synonyms: z
    .string()
    .nonempty({ message: "Synonym Must Contain At Least 1 Character(S)" })
    .transform((value) => value.split(",").map((item) => item.trim())),
});
export type AddSynonymsInput = z.TypeOf<typeof addSynonymsSchema>;

export const addPluralsSchema = z.object({
  id: z.string(),
  plural: z
    .string()
    .nonempty({ message: "Plural Must Contain At Least 1 Character(S)" })
    .transform((value) => value.split(",").map((item) => item.trim())),
});
export type AddPluralsInput = z.TypeOf<typeof addPluralsSchema>;

export const removeWordsSchema = z.object({
  id: z.string(),
  words: z.array(z.string()),
});
export type RemoveWordsInput = z.TypeOf<typeof removeWordsSchema>;
