import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddExpenseButtonProps {
  onClick: () => void;
}

export default function AddExpenseButton({ onClick }: AddExpenseButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="bg-blue-500 text-black font-medium py-4 px-4 rounded-xl shadow-sm border border-primary-200 flex items-center justify-center hover:bg-blue-500 hover:text-black"
      onClick={onClick}
    >
      <PlusIcon className="mr-2 h-5 w-5" />
      Add Expense
    </Button>
  );
}
