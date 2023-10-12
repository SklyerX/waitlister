import { z } from "zod";

export const EmailValidator = z.object({
  email: z.string().email(),
});

export type EmailCredentials = z.infer<typeof EmailValidator>;
