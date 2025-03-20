import * as z from "zod";

export const moduleSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const modulesSchema = z.object({
  modules: z.array(moduleSchema),
});

export type Module = z.infer<typeof moduleSchema>;
export type Modules = z.infer<typeof modulesSchema>;
