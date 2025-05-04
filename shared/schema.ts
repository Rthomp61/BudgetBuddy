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

// Runtime type that will actually be used
export interface Transaction {
  id: number;
  category: string;
  amount: number;
  date: Date;
}

// Budget types
export interface Budget {
  income: number;
  expenses: number;
  remaining: number;
  bondPayment: number;
}

// This is replaced by our explicit Transaction interface above
// export type Transaction = typeof transactions.$inferSelect;

// Create transaction schema with additional validation and transformations
export const createTransactionSchema = z.object({
  category: z.string(),
  amount: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  date: z.union([z.date(), z.string()]).transform(val => 
    typeof val === 'string' ? new Date(val) : val
  )
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
