import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Transaction, CreateTransactionInput, TimeFrame } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTransactions(timeFrame: TimeFrame) {
  const { toast } = useToast();
  
  const { data = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: [`/api/transactions?timeFrame=${timeFrame}`]
  });
  
  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: CreateTransactionInput) => {
      const response = await apiRequest("POST", "/api/transactions", newTransaction);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate transactions queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      // Also invalidate budget as it will be affected by the new transaction
      queryClient.invalidateQueries({ queryKey: ['/api/budget'] });
    },
    onError: (error) => {
      console.error("Failed to add transaction:", error);
      toast({
        title: "Error adding transaction",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  });
  
  const addTransaction = async (newTransaction: CreateTransactionInput) => {
    await addTransactionMutation.mutateAsync(newTransaction);
  };
  
  if (error) {
    console.error("Error fetching transactions", error);
    toast({
      title: "Error loading transactions",
      description: "Please try refreshing the page",
      variant: "destructive"
    });
  }
  
  return {
    transactions: data,
    isLoading: isLoading || addTransactionMutation.isPending,
    addTransaction
  };
}
