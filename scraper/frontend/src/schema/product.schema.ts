import { productCategorySchema } from "@/schema/category.schema";
import z from "zod";

export const productSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string().nullish(),
    image: z.string().nullish(),
    price: z.number().nullish(),
    price_usd: z.number().nullish(),
    description: z.string().nullish(),
    categories: z.array(productCategorySchema),
    tags: z.array(z.string()),
    markup: z.number().nullish(),
    estimated_markup: z.number().nullish(),
    review_score: z.number().nullish(),
    review_number: z.number().nullish(),
    customer_id: z.string().nullish(),
    customer_name: z.string().nullish(),
    created_at: z.string(),
    updated_at: z.string().nullish(),
    timestamp: z.number(),
    scraper_categories: z.array(productCategorySchema).nullish(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const productsSchema = z.object({
  products: z.array(productSchema),
});

export type ProductEntity = z.TypeOf<typeof productSchema>;
export type ProductsEntity = z.TypeOf<typeof productsSchema>;

export const scoreSchema = z.object({
  _id: z.string().optional(),
  lowest: z.number().nullish(),
  highest: z.number().nullish(),
  markup_percent: z.number().nullish(),
});

export const scoresSchema = z.object({
  scores: z.array(scoreSchema),
});

export type ScoreEntity = z.TypeOf<typeof scoreSchema>;
export type ScoresEntity = z.TypeOf<typeof scoresSchema>;
