import * as z from "zod";

export const companySchema = z.object({
  _id: z.string(),
  name: z.string(),
  lwa: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    accessToken: z.string().nullish(),
    refreshToken: z.string(),
  }),
  ads: z.object({
    redirectUri: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
    accessToken: z.string().nullish(),
    refreshToken: z.string(),
  }),
});

export const companysSchema = z.object({
  companys: z.array(companySchema),
});

export const createCompanyBody = z.object({
  name: z.string().min(1, { message: "Please input a name" }),
  lwa: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    accessToken: z.string().nullish(),
    refreshToken: z.string(),
  }),
  ads: z.object({
    redirectUri: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
    accessToken: z.string().nullish(),
    refreshToken: z.string(),
  }),
});

export const updateCompanyBody = createCompanyBody.extend({
  active: z.boolean(),
});

export type Company = z.infer<typeof companySchema>;
export type Companys = z.infer<typeof companysSchema>;
export type CreateCompanyDTO = z.infer<typeof createCompanyBody>;
export type UpdateCompanyDTO = z.infer<typeof updateCompanyBody>;
