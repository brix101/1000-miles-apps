import { signInSchema } from "@repo/schema";
import z from "zod";

export const authenticateSchema = z.object({
  body: signInSchema,
});

export type AuthenticateDTO = z.TypeOf<typeof authenticateSchema>;
