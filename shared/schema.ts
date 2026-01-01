import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't necessarily need a table for the mocked MVP, but we'll keep the user table for structure
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// === Generation Result Types (for the mocked response) ===

export const estimateRangeSchema = z.object({
  low: z.number(),
  high: z.number(),
  currency: z.string().default("USD"),
});

export const breakdownItemSchema = z.object({
  category: z.string(),
  materialsLow: z.number(),
  materialsHigh: z.number(),
  laborLow: z.number(),
  laborHigh: z.number(),
  totalLow: z.number(),
  totalHigh: z.number(),
});

export const generationResultSchema = z.object({
  afterImageUrl: z.string(),
  whatApplied: z.array(z.string()),
  estimateRange: estimateRangeSchema,
  breakdown: z.array(breakdownItemSchema),
  laborSubtotal: z.object({
    low: z.number(),
    high: z.number(),
  }),
  totalEstimate: z.object({
    low: z.number(),
    high: z.number(),
  }),
  upgradeTips: z.array(z.string()),
  savingsTips: z.array(z.string()),
});

export type GenerationResult = z.infer<typeof generationResultSchema>;
export type EstimateRange = z.infer<typeof estimateRangeSchema>;
export type BreakdownItem = z.infer<typeof breakdownItemSchema>;
