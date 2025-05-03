import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddExpenseButtonProps {
  onClick: () => void;
}

export default function AddExpenseButton({ onClick }: AddExpenseButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="bg-white text-primary-600 font-medium py-4 px-4 rounded-xl shadow-sm border border-primary-200 flex items-center justify-center"
      onClick={onClick}
    >
      <PlusIcon className="mr-2 h-5 w-5" />
      Add Expense
    </Button>
  );
}
