import { BellIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary-500 text-white py-4 border-b-4 border-primary-700 shadow-md relative">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide">EMS</h1>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold hidden sm:block">
          Expense Management System
        </h2>
        <button className="focus:outline-none">
          <BellIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
