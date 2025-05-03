import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Budget } from "@shared/schema";

interface BudgetSummaryProps {
  budget: Budget | undefined;
  isLoading: boolean;
}

export default function BudgetSummary({ budget, isLoading }: BudgetSummaryProps) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
          <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
        
        <Skeleton className="h-2.5 w-full rounded-full mb-1" />
        <Skeleton className="h-3 w-1/6" />
      </Card>
    );
  }
  
  if (!budget) {
    return (
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Budget Summary</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">{currentMonth} {currentYear}</div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
          <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Income</p>
            <p className="text-primary-600 dark:text-primary-400 text-xl font-bold">$0.00</p>
          </div>
          <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Expenses</p>
            <p className="text-destructive dark:text-red-400 text-xl font-bold">$0.00</p>
          </div>
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Remaining</p>
            <p className="text-blue-600 dark:text-blue-400 text-xl font-bold">$0.00</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-1">
          <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">100% of budget remaining</p>
      </Card>
    );
  }
  
  // Calculate percentage of budget remaining
  const totalBudget = budget.income;
  const remainingPercentage = totalBudget > 0 
    ? Math.round((budget.remaining / totalBudget) * 100) 
    : 100;
  
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Budget Summary</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">{currentMonth} {currentYear}</div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
        <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Income</p>
          <p className="text-primary-600 dark:text-primary-400 text-xl font-bold">
            {budget.income.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Expenses</p>
          <p className="text-destructive dark:text-red-400 text-xl font-bold">
            {budget.expenses.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 flex-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Remaining</p>
          <p className="text-blue-600 dark:text-blue-400 text-xl font-bold">
            {budget.remaining.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-1">
        <div 
          className="bg-primary-500 h-2.5 rounded-full" 
          style={{ width: `${remainingPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{remainingPercentage}% of budget remaining</p>
    </Card>
  );
}
