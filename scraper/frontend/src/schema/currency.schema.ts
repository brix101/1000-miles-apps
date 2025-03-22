import z from "zod";

export const currencySchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    code: z.string(),
    symbol: z.string(),
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const currenciesSchema = z.object({
  currencies: z.array(currencySchema),
});

export type CurrencyEntity = z.TypeOf<typeof currencySchema>;
export type CurrenciesEntity = z.TypeOf<typeof currenciesSchema>;
