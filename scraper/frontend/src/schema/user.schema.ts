import { permissionSchema } from "@/schema/permission.schema";
import { roleSchema } from "@/schema/role.schema";
import z from "zod";

export const userSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    status: z.string(),
    active: z.boolean(),
    image_url: z.string().nullish(),
    created_at: z.string(),
    updated_at: z.string(),
    permission_id: permissionSchema.optional(),
    role_id: roleSchema.optional(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export type UserEntity = z.TypeOf<typeof userSchema>;

export const usersSchema = z.object({
  users: z.array(userSchema),
});
export type UsersEntity = z.TypeOf<typeof usersSchema>;

export const baseUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must containt atleast 3 character(s)" }),
  email: z.string().email(),
  permission_id: z
    .string()
    .nonempty({ message: "Please select a user permission" }),
  role_id: z
    .string()
    .nonempty({ message: "Please select a user company role" }),
  status: z.string().default("Active"),
  active: z.boolean().default(true),
});

export const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must containt atleast 8 character(s)" }),
  file: z.instanceof(File).optional().nullable().default(null),
});
export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const updateUserSchema = baseUserSchema.extend({
  id: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must containt atleast 8 character(s)" })
    .optional()
    .or(z.literal("")),
  file: z.instanceof(File).optional().nullable().default(null),
});

export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>;
