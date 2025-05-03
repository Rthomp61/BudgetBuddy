import { pgTable, text, serial, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Time frame types
export type TimeFrame = "daily" | "weekly" | "monthly" | "future";

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
});

// Budget types
export interface Budget {
  income: number;
  expenses: number;
  remaining: number;
  bondPayment: number;
}

// Transaction types
export type Transaction = typeof transactions.$inferSelect;

// Create transaction schema
export const createTransactionSchema = createInsertSchema(transactions).pick({
  category: true,
  amount: true,
  date: true,
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
