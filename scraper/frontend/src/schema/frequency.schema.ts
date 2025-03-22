import z from "zod";

export const frequencySchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    days: z.number(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const frequenciesSchema = z.object({
  frequencies: z.array(frequencySchema),
});

export type FrequencyEntity = z.TypeOf<typeof frequencySchema>;
export type FrequenciesEntity = z.TypeOf<typeof frequenciesSchema>;
