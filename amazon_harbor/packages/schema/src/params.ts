import * as z from "zod";

export const params = z.object({
  id: z.string({
    required_error: "id is required",
  }),
});
