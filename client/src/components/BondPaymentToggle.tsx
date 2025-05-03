import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BondPaymentToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  bondAmount: number | undefined;
}

export default function BondPaymentToggle({ 
  enabled, 
  onToggle,
  bondAmount = 0
}: BondPaymentToggleProps) {
  const formattedAmount = bondAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
      <CardContent className="flex items-center justify-between p-0">
        <div>
          <h3 className="font-medium dark:text-white">Bond Payment</h3>
          <p className="text-sm text-gray-500 dark:text-white">
            Apply 15% of salary ({formattedAmount})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="bond-payment-toggle"
            checked={enabled}
            onCheckedChange={onToggle}
          />
          <Label htmlFor="bond-payment-toggle" className="sr-only">
            Toggle bond payment
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
