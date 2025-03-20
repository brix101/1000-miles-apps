import { createUserBody, params } from "@repo/schema";
import * as z from "zod";

const body = createUserBody;

export const getUserSchema = z.object({ params });
export const createUserSchema = z.object({ body });

export type GetUserDTO = z.TypeOf<typeof getUserSchema>;
export type CreateUserDTO = z.TypeOf<typeof createUserSchema>;
