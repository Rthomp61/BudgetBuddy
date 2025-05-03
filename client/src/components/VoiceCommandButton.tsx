import { MicIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceCommandButtonProps {
  onClick: () => void;
}

export default function VoiceCommandButton({ onClick }: VoiceCommandButtonProps) {
  return (
    <Button 
      className="bg-primary-500 text-white font-medium py-4 px-4 rounded-xl shadow-sm flex items-center justify-center relative overflow-hidden"
      onClick={onClick}
    >
      <MicIcon className="mr-2 h-5 w-5" />
      Voice Command
    </Button>
  );
}
