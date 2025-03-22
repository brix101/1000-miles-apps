import z from "zod";

export const roleSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const rolesSchema = z.object({
  roles: z.array(roleSchema),
});

export type RoleEntity = z.TypeOf<typeof roleSchema>;
export type RolesEntity = z.TypeOf<typeof rolesSchema>;
