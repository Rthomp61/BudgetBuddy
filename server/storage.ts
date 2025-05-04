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
    const allTransactions = Array.from(this.transactions.values());
    const now = new Date();
    
    // Filter transactions based on time frame
    switch (timeFrame) {
      case "daily":
        // Get transactions for today
        return allTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getDate() === now.getDate() &&
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        });
        
      case "weekly":
        // Get transactions for current week
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return allTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= oneWeekAgo && transactionDate <= now;
        });
        
      case "monthly":
        // Get transactions for current month
        return allTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        });
        
      case "future":
        // Get future transactions
        return allTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate > now;
        });
        
      default:
        return allTransactions;
    }
  }
  
  async createTransaction(transaction: CreateTransactionInput): Promise<Transaction> {
    const id = this.currentTransactionId++;
    
    // Ensure proper data types
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
      
    // Make sure we have a valid date object
    let date: Date;
    if (transaction.date instanceof Date) {
      date = transaction.date;
    } else {
      date = new Date(transaction.date);
    }
    
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
    
    // Sample transactions
    const sampleTransactions: CreateTransactionInput[] = [
      {
        category: "Salary",
        amount: 5800,
        date: new Date(thisYear, thisMonth, 1).toISOString()
      },
      {
        category: "Mortgage",
        amount: -1500,
        date: new Date(thisYear, thisMonth, 5).toISOString()
      },
      {
        category: "Car Payment",
        amount: -450.75,
        date: new Date(thisYear, thisMonth, 10).toISOString()
      },
      {
        category: "Shopping",
        amount: -120,
        date: new Date(thisYear, thisMonth, 12).toISOString()
      },
      {
        category: "Clothes",
        amount: -200,
        date: new Date(thisYear, thisMonth, 15).toISOString()
      },
      {
        category: "Reimbursement",
        amount: 143.50,
        date: new Date(thisYear, thisMonth, 18).toISOString()
      },
      // Future transaction
      {
        category: "Travel",
        amount: -800,
        date: new Date(thisYear, thisMonth + 1, 5).toISOString()
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
