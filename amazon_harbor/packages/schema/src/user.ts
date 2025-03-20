import * as z from "zod";
import { moduleSchema } from ".";

export const userSchema = z.object({
  _id: z.string(),
  email: z.string(),
  name: z.string(),
  active: z.boolean(),
  isSuperAdmin: z.boolean(),
  image_url: z.string().nullish(),
  createAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  allowedModules: z.array(moduleSchema),
});

export const usersSchema = z.object({
  users: z.array(userSchema),
});

export const activeUserSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

const baseUserBody = z.object({
  email: z.string().email(),
  name: z.string().min(1, { message: "Please input a name" }),
  isSuperAdmin: z.boolean(),
  allowedModules: z.array(z.string()).default([]),
});

export const createUserBody = baseUserBody.extend({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100),
});

export const updateUserBody = baseUserBody.extend({
  password: z.string().refine((value) => value === "" || value.length >= 8, {
    message: "Password must be empty or at least 8 characters long",
  }),
});

export type User = z.infer<typeof userSchema>;
export type Users = z.infer<typeof usersSchema>;
export type ActiveUser = z.infer<typeof activeUserSchema>;
export type CreateUserDTO = z.infer<typeof createUserBody>;
export type UpdateUserDTO = z.infer<typeof updateUserBody>;
