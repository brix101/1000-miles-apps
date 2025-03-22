import z from "zod";

export const countrySchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    code: z.string(),
    short_name: z.string(),
    phone_code: z.string(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const countriesSchema = z.object({
  countries: z.array(countrySchema),
});

export type CountryEntity = z.TypeOf<typeof countrySchema>;
export type CountriesEntity = z.TypeOf<typeof countriesSchema>;
