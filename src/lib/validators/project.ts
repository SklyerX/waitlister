import { z } from "zod";

export const ProjectValidator = z.object({
  name: z.string().min(1).max(50),
});

export type ProjectCredentials = z.infer<typeof ProjectValidator>;
