import { useState } from "react";
import BudgetSummary from "@/components/BudgetSummary";
import TimeFrameSelector from "@/components/TimeFrameSelector";
import BondPaymentToggle from "@/components/BondPaymentToggle";
import TransactionsList from "@/components/TransactionsList";
import AddExpenseButton from "@/components/AddExpenseButton";
import VoiceCommandButton from "@/components/VoiceCommandButton";
import AddExpenseModal from "@/components/AddExpenseModal";
import VoiceCommandModal from "@/components/VoiceCommandModal";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
import { TimeFrame } from "@shared/schema";

export default function Home() {
  // Always use monthly for the home page to show monthly budget
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly");
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isVoiceCommandModalOpen, setIsVoiceCommandModalOpen] = useState(false);
  const [bondPaymentEnabled, setBondPaymentEnabled] = useState(true);
  
  const { 
    transactions, 
    isLoading: isTransactionsLoading, 
    addTransaction 
  } = useTransactions(timeFrame);
  
  const { 
    budget,
    isLoading: isBudgetLoading 
  } = useBudget(bondPaymentEnabled);

  return (
    <div className="container mx-auto py-4 px-4">
      <BudgetSummary budget={budget} isLoading={isBudgetLoading} />
      
      <TimeFrameSelector 
        timeFrame={timeFrame} 
        onTimeFrameChange={setTimeFrame} 
      />
      
      <BondPaymentToggle 
        enabled={bondPaymentEnabled}
        onToggle={setBondPaymentEnabled}
        bondAmount={budget?.bondPayment}
      />
      
      <h3 className="font-bold text-lg mb-3">Monthly Budget Expenses</h3>
      
      <TransactionsList 
        transactions={transactions} 
        isLoading={isTransactionsLoading} 
      />
      
      <div className="grid grid-cols-2 gap-4 mb-20">
        <AddExpenseButton onClick={() => setIsAddExpenseModalOpen(true)} />
        <VoiceCommandButton onClick={() => setIsVoiceCommandModalOpen(true)} />
      </div>
      
      <AddExpenseModal 
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onAddTransaction={addTransaction}
      />
      
      <VoiceCommandModal
        isOpen={isVoiceCommandModalOpen}
        onClose={() => setIsVoiceCommandModalOpen(false)}
        onAddTransaction={addTransaction}
      />
    </div>
  );
}
