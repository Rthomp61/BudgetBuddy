import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateTransactionInput } from "@shared/schema";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: CreateTransactionInput) => Promise<void>;
}

export default function AddExpenseModal({ 
  isOpen, 
  onClose,
  onAddTransaction
}: AddExpenseModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  // Ensure today's date is used by default
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);

  const incomeCategories = [
    "Salary", "Gifts", "Reimbursement", "Inheritance", "Bonus", "Repayment"
  ];
  
  const expenseCategories = [
    "Clothes", "Fuel", "Car Payment", "Shopping", "Sports", "Travel", "Entertainment", "Mortgage"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      toast({
        title: "Missing category",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const isIncome = incomeCategories.includes(category);
      const parsedAmount = parseFloat(amount) * (isIncome ? 1 : -1);
      
      // Make sure all form fields are filled
      if (!category || !amount || !date) {
        toast({
          title: "Missing fields",
          description: "Please fill out all fields",
          variant: "destructive"
        });
        return;
      }
      
      // Convert date to ISO string but ensure it's valid
      const dateObj = new Date(date);
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        toast({
          title: "Invalid date",
          description: "Please select a valid date",
          variant: "destructive"
        });
        return;
      }
      
      try {
        // Force type conversion for API compatibility
        await onAddTransaction({
          category,
          // @ts-ignore - Schema handles this properly at runtime
          amount: parsedAmount,
          // @ts-ignore - Schema handles this properly at runtime
          date: dateObj
        });
      } catch (err) {
        console.error("API error:", err);
        throw err;
      }
      
      toast({
        title: "Success!",
        description: "Your transaction has been added"
      });
      
      // Reset form and close modal
      setCategory("");
      setAmount("");
      // Reset to today's date properly
      setDate(todayStr);
      onClose();
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please ensure all fields are correctly filled.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Income</SelectLabel>
                    {incomeCategories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-primary-600">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Expenses</SelectLabel>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
