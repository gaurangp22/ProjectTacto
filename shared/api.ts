import { z } from "zod";

export const ROLES = ["educator", "parent", "school", "learner", "researcher", "other"] as const;

export const WaitlistInput = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.enum(ROLES).default("other"),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  website: z.string().max(0).optional(), // honeypot, must stay empty
});
export type WaitlistInput = z.infer<typeof WaitlistInput>;

export const ContactInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  role: z.string().trim().max(80).optional().or(z.literal("")),
  topic: z.enum(["pilot", "partnership", "press", "general"]).default("general"),
  message: z.string().trim().min(2).max(4000),
  website: z.string().max(0).optional(),
});
export type ContactInput = z.infer<typeof ContactInput>;

export const ProgressInput = z.object({
  learnerId: z.string().regex(/^[a-z0-9-]{16,64}$/i),
  lessonId: z.string().regex(/^[a-z0-9-]{1,64}$/i),
  stars: z.number().int().min(0).max(3),
  blocks: z.number().int().min(0).max(500).optional(),
});
export type ProgressInput = z.infer<typeof ProgressInput>;

export interface ProgressRow {
  lessonId: string;
  stars: number;
  bestBlocks: number | null;
}

export interface ApiOk<T = unknown> {
  ok: true;
  data?: T;
}
export interface ApiErr {
  ok: false;
  error: string;
}
