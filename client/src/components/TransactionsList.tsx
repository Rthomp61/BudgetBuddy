import { Transaction as TransactionType } from "@shared/schema";
import TransactionItem from "./Transaction";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionsListProps {
  transactions: TransactionType[];
  isLoading: boolean;
}

export default function TransactionsList({ 
  transactions, 
  isLoading 
}: TransactionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-3" />
              <div>
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <Skeleton className="w-20 h-5" />
          </div>
        ))}
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
        <p className="text-gray-500">No transactions yet. Add an expense to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 mb-8">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
