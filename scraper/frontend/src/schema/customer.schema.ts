import { countrySchema } from "@/schema/country.schema";
import { currencySchema } from "@/schema/currency.schema";
import { customerTypeSchema } from "@/schema/customerType.schema";
import { frequencySchema } from "@/schema/frequency.schema";
import { languageSchema } from "@/schema/language.schema";
import z from "zod";

export const customerSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    markup: z.number(),
    website: z.string(),
    image_url: z.string().nullish(),
    spider_name: z.string().nullish(),
    spider_code: z.string().nullish(),
    require_login: z.boolean(),
    username: z.string().nullish(),
    password: z.string().nullish(),
    total_products: z.number().nullish(),
    scrape_status: z.enum(["success", "running", "error"]).nullish(),
    country: countrySchema,
    currency: currencySchema,
    frequency: frequencySchema,
    language: languageSchema,
    type: customerTypeSchema,
    active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
    last_scraped: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));
export type CustomerEntity = z.TypeOf<typeof customerSchema>;

export const customersSchema = z.object({
  customers: z.array(customerSchema),
});
export type CustomersEntity = z.TypeOf<typeof customersSchema>;

const baseCustomerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must containt atleast 3 character(s)" }),
  markup: z.number(),
  spider_name: z.string().optional(),
  spider_code: z.string().optional(),
  website: z
    .string()
    .url({ message: "Please input a valid website url" })
    .nonempty(),
  require_login: z.boolean(),
  username: z.string().email().optional(),
  password: z.string().optional(),
  country: z.string().nonempty({ message: "Please select a valid Country" }),
  currency: z.string().nonempty({ message: "Please select a valid Currency" }),
  frequency: z
    .string()
    .nonempty({ message: "Please select a valid Frequency" }),
  language: z.string().nonempty({ message: "Please select a valid Language" }),
  type: z.string().nonempty({ message: "Please select a valid type" }),
  file: z.instanceof(File).optional().nullable().default(null),
  code: z.instanceof(File).optional().nullable().default(null),
});

export const newCustomerSchema = baseCustomerSchema
  .refine(
    (data) => !data.require_login || (data.require_login && data.username),
    {
      message: "Email is required",
      path: ["username"],
    }
  )
  .refine(
    (data) => !data.require_login || (data.require_login && data.password),
    {
      message: "Password is required",
      path: ["password"],
    }
  );

export type NewCustomerInput = z.TypeOf<typeof newCustomerSchema>;

export const updateCustomerSchema = baseCustomerSchema
  .extend({
    id: z.string(),
  })
  .refine(
    (data) => !data.require_login || (data.require_login && data.username),
    {
      message: "Email is required",
      path: ["username"],
    }
  )
  .refine(
    (data) => !data.require_login || (data.require_login && data.password),
    {
      message: "Password is required",
      path: ["password"],
    }
  );

export type UpdateCustomerInput = z.TypeOf<typeof updateCustomerSchema>;
