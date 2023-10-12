import { z } from "zod";

export const WebhookValidator = z.object({
  endpoint: z.string().url(),
  description: z.string().max(256).optional(),
});

export type WebhookCredentials = z.infer<typeof WebhookValidator>;
