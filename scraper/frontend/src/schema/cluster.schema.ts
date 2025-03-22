import z from "zod";
import { userSchema } from "./user.schema";

export const clusterSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    categories: z.array(z.string()),
    customers: z.array(z.string()),
    tags: z.array(z.string()),
    active: z.boolean(),
    created_by: userSchema,
    created_at: z.string(),
    updated_at: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    _id: obj._id || obj.id,
    id: obj.id || obj._id,
  }));
export type ClusterEntity = z.TypeOf<typeof clusterSchema>;

export const clustersSchema = z.object({
  clusters: z.array(clusterSchema),
});
export type ClustersEntity = z.TypeOf<typeof clustersSchema>;

export const createClusterSchema = z.object({
  name: z.string().nonempty({ message: "Please Input a name" }),
  categories: z.array(z.string()).optional(),
  customers: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateClusterInput = z.TypeOf<typeof createClusterSchema>;

export const updateClusterSchema = createClusterSchema.extend({
  id: z.string(),
});

export type UpdateClusterInput = z.TypeOf<typeof updateClusterSchema>;
