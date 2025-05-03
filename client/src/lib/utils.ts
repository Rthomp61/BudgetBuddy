import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CreateTransactionInput } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INCOME_CATEGORIES = [
  "salary", "gift", "reimbursement", "inheritance", "bonus", "repayment"
];

const EXPENSE_CATEGORIES = [
  "clothes", "fuel", "car payment", "shopping", "sports", "travel", 
  "entertainment", "mortgage", "payment", "rent", "grocery"
];

/**
 * Attempts to parse a voice command into a transaction
 * Example: "Mortgage payment $1500 on May 5th" 
 */
export function parseVoiceCommand(command: string): CreateTransactionInput | null {
  if (!command) return null;
  
  const lowerCommand = command.toLowerCase();
  
  // Try to find a category in the command
  let category = '';
  
  // First check for income categories
  for (const cat of INCOME_CATEGORIES) {
    if (lowerCommand.includes(cat)) {
      category = cat.charAt(0).toUpperCase() + cat.slice(1);
      break;
    }
  }
  
  // If no income category found, check for expense categories
  if (!category) {
    for (const cat of EXPENSE_CATEGORIES) {
      if (lowerCommand.includes(cat)) {
        category = cat.charAt(0).toUpperCase() + cat.slice(1);
        break;
      }
    }
  }
  
  // If still no category, use a default
  if (!category) {
    // Check if it's likely to be an income by looking for positive keywords
    if (lowerCommand.includes('receive') || lowerCommand.includes('got') || lowerCommand.includes('earned')) {
      category = 'Income';
    } else {
      category = 'Expense';
    }
  }
  
  // Try to find an amount in the command using a regex to match currency patterns
  const amountMatch = lowerCommand.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
  
  // Determine if this is income or expense
  const isIncome = INCOME_CATEGORIES.some(cat => lowerCommand.includes(cat));
  const finalAmount = isIncome ? amount : -amount;
  
  // Try to parse a date from the command
  let date = new Date();
  
  // Check for "on [date]" pattern
  const onDateMatch = lowerCommand.match(/on\s+(\w+\s+\d+(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?)/i);
  
  if (onDateMatch) {
    const dateString = onDateMatch[1]
      .replace(/(st|nd|rd|th)/g, '') // Remove ordinal suffixes
      .trim();
    
    // Try to parse the date
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  } else {
    // Look for month names and try to extract date
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june', 
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const monthRegex = new RegExp(`${month}\\s+(\\d+)(?:st|nd|rd|th)?(?:\\s*,?\\s*(\\d{4}))?`, 'i');
      const monthMatch = lowerCommand.match(monthRegex);
      
      if (monthMatch) {
        const day = parseInt(monthMatch[1], 10);
        const year = monthMatch[2] ? parseInt(monthMatch[2], 10) : new Date().getFullYear();
        
        date.setFullYear(year, i, day);
        break;
      }
    }
  }
  
  return {
    category,
    amount: finalAmount,
    date: date.toISOString()
  };
}
