import { z } from "zod";

export const updateClientNameSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
});

export type updateClientNameData = z.infer<typeof updateClientNameSchema>;
