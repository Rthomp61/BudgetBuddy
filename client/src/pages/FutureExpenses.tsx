import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, DollarSignIcon, ClockIcon } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

export default function FutureExpenses() {
  // Get future transactions (those with dates in the future)
  const { transactions, isLoading } = useTransactions("future");

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Future Expenses</h1>
        <p className="text-gray-500">Plan and track your upcoming expenses</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <Card className="w-full">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <ClockIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Upcoming Expenses</h3>
            <p className="text-gray-500 max-w-md">
              You don't have any future expenses scheduled. Add an expense with a future date to see it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="expense-item w-full">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${transaction.amount > 0 ? 'bg-primary-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
                      {transaction.amount > 0 ? (
                        <DollarSignIcon className="text-primary-600 h-5 w-5" />
                      ) : (
                        <DollarSignIcon className="text-red-600 h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <p>{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.amount > 0 ? 'text-primary-600' : 'text-destructive'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
