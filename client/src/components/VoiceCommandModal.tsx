import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateTransactionInput } from "@shared/schema";
import { startSpeechRecognition, stopSpeechRecognition } from "@/lib/speechRecognition";
import { parseVoiceCommand } from "@/lib/utils";

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: CreateTransactionInput) => Promise<void>;
}

export default function VoiceCommandModal({ 
  isOpen, 
  onClose,
  onAddTransaction
}: VoiceCommandModalProps) {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedTransaction, setParsedTransaction] = useState<CreateTransactionInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isOpen) {
      setIsListening(true);
      startSpeechRecognition((result) => {
        setTranscript(result);
        
        try {
          const parsed = parseVoiceCommand(result);
          if (parsed) {
            setParsedTransaction(parsed);
            setIsListening(false);
            stopSpeechRecognition();
          }
        } catch (error) {
          console.error("Failed to parse voice command:", error);
        }
      });
      
      // Auto-stop after 10 seconds if no result
      timeoutId = setTimeout(() => {
        if (isListening) {
          setIsListening(false);
          stopSpeechRecognition();
          if (!transcript) {
            toast({
              title: "No speech detected",
              description: "Please try again and speak clearly",
              variant: "destructive"
            });
          }
        }
      }, 10000);
    }
    
    return () => {
      clearTimeout(timeoutId);
      stopSpeechRecognition();
      setIsListening(false);
      setTranscript("");
      setParsedTransaction(null);
    };
  }, [isOpen, toast]);

  const handleSubmit = async () => {
    if (!parsedTransaction) return;
    
    try {
      setIsSubmitting(true);
      await onAddTransaction(parsedTransaction);
      
      toast({
        title: "Success!",
        description: "Your voice expense has been added"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetVoiceInput = () => {
    setTranscript("");
    setParsedTransaction(null);
    setIsListening(true);
    startSpeechRecognition((result) => {
      setTranscript(result);
      try {
        const parsed = parseVoiceCommand(result);
        if (parsed) {
          setParsedTransaction(parsed);
          setIsListening(false);
          stopSpeechRecognition();
        }
      } catch (error) {
        console.error("Failed to parse voice command:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <div 
            className={`w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6 ${isListening ? "recording-pulse" : ""}`}
          >
            {isListening ? (
              <Mic className="h-10 w-10 text-primary-500" />
            ) : (
              <MicOff className="h-10 w-10 text-gray-500" />
            )}
          </div>
          
          <h3 className="font-bold text-xl mb-2">
            {isListening ? "Listening..." : "Voice Recognized"}
          </h3>
          <p className="text-gray-500 mb-4">
            {isListening 
              ? 'Say something like "Mortgage payment $1500 on May 5th"'
              : 'Check if the information below is correct'
            }
          </p>
          
          {(transcript || parsedTransaction) && (
            <div className="w-full bg-gray-100 rounded-lg p-4 mb-6 min-h-16">
              {transcript && (
                <>
                  <p className="font-medium">Recognized:</p>
                  <p className="text-gray-700 italic">{transcript}</p>
                </>
              )}
              
              {parsedTransaction && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="font-medium">Parsed:</p>
                  <ul className="text-left text-sm">
                    <li>Category: <span className="font-semibold">{parsedTransaction.category}</span></li>
                    <li>Amount: <span className="font-semibold">${Math.abs(parsedTransaction.amount).toFixed(2)}</span></li>
                    <li>Date: <span className="font-semibold">{new Date(parsedTransaction.date).toLocaleDateString()}</span></li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="w-full flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {parsedTransaction ? (
              <>
                <Button variant="outline" onClick={resetVoiceInput}>
                  Try Again
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Confirm"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={resetVoiceInput} disabled={isListening}>
                Try Again
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
