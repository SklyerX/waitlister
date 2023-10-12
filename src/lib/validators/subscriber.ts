import validator from "validator";
import { z } from "zod";

// Phone regex: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/

export const SubscriberValidator = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().refine(validator.isMobilePhone).optional(),
  metadata: z.any().optional(),
  email: z.string().email(),
  referredBy: z.string().optional(),
});

export type SubscriberCredentials = z.infer<typeof SubscriberValidator>;
