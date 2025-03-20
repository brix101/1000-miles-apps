import { createCompanyBody, params } from "@repo/schema";
import * as z from "zod";

const body = createCompanyBody;

export const getCompanySchema = z.object({ params });
export const createCompanySchema = z.object({ body });

export type GetCompanyDTO = z.TypeOf<typeof getCompanySchema>;
export type CreateCompanyDTO = z.TypeOf<typeof createCompanySchema>;
