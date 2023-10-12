import { z } from "zod";

export const DomainValidator = z.object({
  url: z.string().url(),
});

export type DomainCredentials = z.infer<typeof DomainValidator>;
