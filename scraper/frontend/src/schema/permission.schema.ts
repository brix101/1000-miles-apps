import z from "zod";

export const permissionSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    read: z.boolean(),
    write: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));

export const permissionsSchema = z.object({
  permissions: z.array(permissionSchema),
});

export type PermissionEntity = z.TypeOf<typeof permissionSchema>;
export type PermissionsEntity = z.TypeOf<typeof permissionsSchema>;
