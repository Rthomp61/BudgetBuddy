import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SettingsIcon, BellIcon, DollarSignIcon, UserIcon, MoonIcon, SunIcon, TypeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useFontSize } from "@/hooks/useFontSize";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [bondPercentage, setBondPercentage] = useState("15");
  const { theme, setTheme } = useTheme();
  const { fontSize, updateFontSize } = useFontSize();
  
  // Used for hydration issues with server-side rendering
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">Manage your application preferences</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 text-primary-500" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Theme Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? (
                    <MoonIcon className="h-5 w-5 text-blue-400" />
                  ) : (
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                  )}
                  <Label htmlFor="theme-mode" className="font-medium">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
              </div>
              
              {/* Text Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TypeIcon className="h-5 w-5 text-primary-500" />
                  <Label className="font-medium">Text Size</Label>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => updateFontSize('small')}
                  >
                    Small
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-primary-500"
                  >
                    Medium
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => updateFontSize('large')}
                  >
                    Large
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => updateFontSize('extra-large')}
                  >
                    Extra Large
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BellIcon className="h-5 w-5 text-primary-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="expense-notifications" className="flex-1">
                  Expense reminders
                </Label>
                <Switch
                  id="expense-notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bill-notifications" className="flex-1">
                  Bill due dates
                </Label>
                <Switch
                  id="bill-notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-primary-500" />
              <CardTitle>Budget Settings</CardTitle>
            </div>
            <CardDescription>Customize your budget preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bond-percentage">Bond Payment (%)</Label>
                  <Input 
                    id="bond-percentage" 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={bondPercentage}
                    onChange={(e) => setBondPercentage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-primary-500" />
              <CardTitle>Account Settings</CardTitle>
            </div>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="********" readOnly />
              </div>
              
              <Button className="w-full" variant="outline">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
