import { BellIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary-500 text-white py-4 border-b-4 border-primary-700 shadow-md relative dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="invisible">
          <BellIcon className="h-5 w-5" />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-xl font-bold tracking-wide text-moneyGreen">EMS</h1>
          <h2 className="text-lg font-semibold text-moneyGreen">
            Expense Management System
          </h2>
        </div>
        <button className="focus:outline-none">
          <BellIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </header>
  );
}
