import { 
  users, 
  type User, 
  type InsertUser,
  type Transaction,
  type CreateTransactionInput,
  type Budget,
  type TimeFrame,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  getTransactions(timeFrame: TimeFrame): Promise<Transaction[]>;
  createTransaction(transaction: CreateTransactionInput): Promise<Transaction>;
  
  // Budget methods
  getBudget(bondPaymentEnabled: boolean): Promise<Budget>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  currentUserId: number;
  currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    
    // Add some sample transactions for testing
    this.seedSampleTransactions();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getTransactions(timeFrame: TimeFrame): Promise<Transaction[]> {
    // Always use current date for proper filtering
    const now = new Date();
    // Make sure we're using today's date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get all transactions
    const allTransactions = Array.from(this.transactions.values());
    
    // Sort transactions by date (newest first)
    const sortedTransactions = allTransactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    switch (timeFrame) {
      case "daily":
        // Get only today's transactions
        return sortedTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          const transactionDay = new Date(
            transactionDate.getFullYear(),
            transactionDate.getMonth(),
            transactionDate.getDate()
          );
          
          // Compare dates to match exact day
          return (
            transactionDay.getDate() === today.getDate() &&
            transactionDay.getMonth() === today.getMonth() &&
            transactionDay.getFullYear() === today.getFullYear()
          );
        });
        
      case "weekly":
        // Get transactions for the current calendar week (Sunday to Saturday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
        endOfWeek.setHours(23, 59, 59, 999);
        
        return sortedTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          // Clear time portion for accurate date comparison
          const transactionDay = new Date(
            transactionDate.getFullYear(),
            transactionDate.getMonth(),
            transactionDate.getDate()
          );
          
          return transactionDay >= startOfWeek && transactionDay <= endOfWeek;
        });
        
      case "monthly":
        // Get only current month's transactions
        return sortedTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });
        
      case "future":
        // Get future transactions (after today)
        return sortedTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          // Clear time portion for accurate date comparison
          const transactionDay = new Date(
            transactionDate.getFullYear(),
            transactionDate.getMonth(),
            transactionDate.getDate()
          );
          
          return transactionDay > today;
        });
        
      default:
        return sortedTransactions;
    }
  }
  
  async createTransaction(transaction: CreateTransactionInput): Promise<Transaction> {
    const id = this.currentTransactionId++;
    
    // Ensure proper data types for amount
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
      
    // Make sure we have a valid date object that preserves the correct date
    let date: Date;
    if (transaction.date instanceof Date) {
      // Use the provided date but ensure it's for today if no specific date was selected
      date = transaction.date;
    } else {
      // Parse the date string
      date = new Date(transaction.date);
      
      // If date couldn't be parsed correctly or is invalid, use today's date
      if (isNaN(date.getTime())) {
        console.warn("Invalid date received for transaction, using current date");
        date = new Date();
      }
    }
    
    // Log the date to verify it's correct
    console.log("Creating transaction with date:", date.toISOString());
    
    // Create the transaction with proper types
    const newTransaction: Transaction = { 
      id,
      category: transaction.category,
      amount,
      date
    };
    
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
  
  async getBudget(bondPaymentEnabled: boolean): Promise<Budget> {
    // Get all transactions for the current month
    const monthlyTransactions = await this.getTransactions("monthly");
    
    // Calculate income (positive amounts)
    const income = monthlyTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    // Calculate expenses (negative amounts)
    const expenses = Math.abs(
      monthlyTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Number(t.amount), 0)
    );
    
    // Calculate bond payment amount (15% of salary)
    // Find the salary transaction(s)
    const salaryTransactions = monthlyTransactions.filter(
      t => t.category.toLowerCase() === "salary" && t.amount > 0
    );
    
    const totalSalary = salaryTransactions.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );
    
    const bondPayment = totalSalary * 0.15;
    
    // Calculate remaining amount
    let remaining = income - expenses;
    
    // Apply bond payment if enabled
    if (bondPaymentEnabled && bondPayment > 0) {
      remaining -= bondPayment;
    }
    
    return {
      income,
      expenses: expenses + (bondPaymentEnabled ? bondPayment : 0),
      remaining,
      bondPayment
    };
  }
  
  private seedSampleTransactions() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    // Sample transactions with correct types
    const sampleTransactions = [
      {
        category: "Salary",
        amount: 5800,
        date: new Date(thisYear, thisMonth, 1)
      },
      {
        category: "Mortgage",
        amount: -1500,
        date: new Date(thisYear, thisMonth, 5)
      },
      {
        category: "Car Payment",
        amount: -450.75,
        date: new Date(thisYear, thisMonth, 10)
      },
      {
        category: "Shopping",
        amount: -120,
        date: new Date(thisYear, thisMonth, 12)
      },
      {
        category: "Clothes",
        amount: -200,
        date: new Date(thisYear, thisMonth, 15)
      },
      {
        category: "Reimbursement",
        amount: 143.50,
        date: new Date(thisYear, thisMonth, 18)
      },
      // Future transaction
      {
        category: "Travel",
        amount: -800,
        date: new Date(thisYear, thisMonth + 1, 5)
      }
    ];
    
    // Add sample transactions to storage
    sampleTransactions.forEach(transaction => {
      const id = this.currentTransactionId++;
      this.transactions.set(id, { ...transaction, id });
    });
  }
}

export const storage = new MemStorage();
