import { Transaction as TransactionType } from "@shared/schema";
import { 
  DollarSignIcon, 
  ShoppingBagIcon, 
  CarIcon, 
  HomeIcon, 
  ShirtIcon, 
  GiftIcon, 
  RefreshCcwIcon,
  TruckIcon,
  TicketIcon,
  PlaneIcon,
  UtensilsIcon,
  LandmarkIcon,
  PackageIcon
} from "lucide-react";

interface TransactionProps {
  transaction: TransactionType;
}

export default function Transaction({ transaction }: TransactionProps) {
  const isIncome = transaction.amount > 0;
  const formattedAmount = transaction.amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always'
  });

  const getIconForCategory = () => {
    switch (transaction.category.toLowerCase()) {
      case 'salary':
        return <DollarSignIcon className="text-primary-600 h-5 w-5" />;
      case 'gifts':
        return <GiftIcon className="text-primary-600 h-5 w-5" />;
      case 'reimbursement':
        return <RefreshCcwIcon className="text-primary-600 h-5 w-5" />;
      case 'inheritance':
        return <LandmarkIcon className="text-primary-600 h-5 w-5" />;
      case 'bonus':
        return <DollarSignIcon className="text-primary-600 h-5 w-5" />;
      case 'repayment':
        return <RefreshCcwIcon className="text-primary-600 h-5 w-5" />;
      case 'mortgage':
      case 'rent':
        return <HomeIcon className="text-red-600 h-5 w-5" />;
      case 'car payment':
        return <CarIcon className="text-red-600 h-5 w-5" />;
      case 'shopping':
        return <ShoppingBagIcon className="text-red-600 h-5 w-5" />;
      case 'clothes':
        return <ShirtIcon className="text-red-600 h-5 w-5" />;
      case 'fuel':
        return <TruckIcon className="text-red-600 h-5 w-5" />;
      case 'sports':
        return <TicketIcon className="text-red-600 h-5 w-5" />;
      case 'travel':
        return <PlaneIcon className="text-red-600 h-5 w-5" />;
      case 'entertainment':
        return <UtensilsIcon className="text-red-600 h-5 w-5" />;
      default:
        return <PackageIcon className={`${isIncome ? 'text-primary-600' : 'text-red-600'} h-5 w-5`} />;
    }
  };

  return (
    <div className="expense-item bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${isIncome ? 'bg-primary-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
          {getIconForCategory()}
        </div>
        <div>
          <p className="font-medium">{transaction.category}</p>
          <p className="text-xs text-gray-500">
            {new Date(transaction.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
      <p className={`font-semibold ${isIncome ? 'text-primary-600' : 'text-destructive'}`}>
        {formattedAmount}
      </p>
    </div>
  );
}
