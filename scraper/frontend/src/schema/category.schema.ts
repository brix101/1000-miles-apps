import z from "zod";

export const productCategorySchema = z.object({
  name: z.string(),
  level: z.number(),
});

export type ProductCategoryEntity = z.TypeOf<typeof productCategorySchema>;

const baseCategorySchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  category: z.string().nullish(),
  classification: z.string().nullish(),
  level: z.number().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export type NestedCategoryEntity = z.infer<typeof baseCategorySchema> & {
  sub: NestedCategoryEntity[];
};

export const nestedCategorySchema: z.ZodType<NestedCategoryEntity> =
  baseCategorySchema
    .extend({
      sub: z.lazy(() => nestedCategorySchema.array()),
    })
    .transform((obj) => ({
      ...obj,
      _id: obj._id || obj.id,
      id: obj.id || obj._id,
    }));

export type NestedCategory = z.TypeOf<typeof nestedCategorySchema>;

export const nestedCategoriesSchema = z.object({
  categories: z.array(nestedCategorySchema),
});

export type NestedCategoriesEntity = z.TypeOf<typeof nestedCategoriesSchema>;

export const addCategorySchema = z.object({
  category: z
    .string()
    .nonempty({ message: "Category must containt atleast 1 character(s)" }),
});

export type AddCategoryInput = z.TypeOf<typeof addCategorySchema>;

export const updateCategorySchema = addCategorySchema.extend({
  id: z.string(),
});

export type UpdateCategoryInput = z.TypeOf<typeof updateCategorySchema>;

export const removeChildCategorySchema = z
  .object({ id: z.string(), sub_ids: z.array(z.string()) })
  .refine((data) => data.sub_ids.length > 0, {
    message: "Array of IDs must not be empty",
    path: ["sub_ids"],
  });

export type RemoveChildCategoryInput = z.TypeOf<
  typeof removeChildCategorySchema
>;

export const categorySchema = baseCategorySchema.transform((obj) => {
  return {
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  };
});

export type CategoryEntity = z.TypeOf<typeof categorySchema>;

export const paginatedCategoriesSchema = z.object({
  total: z.number(),
  page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
  items_count: z.number(),
  categories: z.array(categorySchema),
});

export type PaginatedCategories = z.TypeOf<typeof paginatedCategoriesSchema>;
