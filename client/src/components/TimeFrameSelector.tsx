import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeFrame } from "@shared/schema";

interface TimeFrameSelectorProps {
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export default function TimeFrameSelector({ 
  timeFrame, 
  onTimeFrameChange 
}: TimeFrameSelectorProps) {
  return (
    <Card className="bg-white rounded-xl shadow-md p-4 mb-6">
      <CardContent className="flex border-b border-gray-200 p-0">
        <Button
          variant="ghost"
          className={`flex-1 py-2 px-4 font-medium rounded-none border-b-2 ${
            timeFrame === "daily"
              ? "text-primary-500 border-primary-500"
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => onTimeFrameChange("daily")}
        >
          Daily
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 py-2 px-4 font-medium rounded-none border-b-2 ${
            timeFrame === "weekly"
              ? "text-primary-500 border-primary-500"
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => onTimeFrameChange("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 py-2 px-4 font-medium rounded-none border-b-2 ${
            timeFrame === "monthly"
              ? "text-primary-500 border-primary-500"
              : "text-gray-500 border-transparent"
          }`}
          onClick={() => onTimeFrameChange("monthly")}
        >
          Monthly
        </Button>
      </CardContent>
    </Card>
  );
}
