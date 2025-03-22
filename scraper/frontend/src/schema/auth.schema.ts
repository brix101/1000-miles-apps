import { userSchema } from "@/schema/user.schema";
import z from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must containt atleast 8 character(s)" }),
});

export const signInResponseSchema = z.object({
  access_token: z.string(),
  user: userSchema,
});

export type SignInInput = z.TypeOf<typeof signInSchema>;
export type SignInResponseSchema = z.TypeOf<typeof signInResponseSchema>;
