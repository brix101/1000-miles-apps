import * as z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter a valid email address" })
    .email({
      message: "Please enter a valid email address",
    }),
  password: z
    .string()
    .min(1, { message: "Password must be at least 8 characters long" })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100),
});

export type SignInDTO = z.infer<typeof signInSchema>;
