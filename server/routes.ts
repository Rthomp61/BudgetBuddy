import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createTransactionSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get transactions with time frame filtering
  app.get("/api/transactions", async (req, res) => {
    try {
      const timeFrame = (req.query.timeFrame as string) || "monthly";
      const transactions = await storage.getTransactions(timeFrame);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Add a new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = createTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(transactionData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // Get budget with bond payment option
  app.get("/api/budget", async (req, res) => {
    try {
      const bondPaymentParam = req.query.bondPayment;
      const bondPaymentEnabled = bondPaymentParam === "true";
      const budget = await storage.getBudget(bondPaymentEnabled);
      res.json(budget);
    } catch (error) {
      console.error("Error fetching budget:", error);
      res.status(500).json({ message: "Failed to fetch budget" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
