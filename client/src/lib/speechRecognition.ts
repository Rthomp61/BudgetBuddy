// Define the callback type for speech recognition results
type SpeechRecognitionCallback = (result: string) => void;

// Check if browser supports speech recognition
const hasSpeechRecognition = () => {
  return (
    'SpeechRecognition' in window ||
    'webkitSpeechRecognition' in window
  );
};

// Get Speech Recognition API (with browser compatibility)
const getSpeechRecognition = (): SpeechRecognition | null => {
  if (!hasSpeechRecognition()) return null;
  
  // @ts-ignore - TypeScript doesn't recognize webkitSpeechRecognition
  return new (window.SpeechRecognition || window.webkitSpeechRecognition)();
};

// Initialize speech recognition instance
let recognition: SpeechRecognition | null = null;

// Start speech recognition with callback
export const startSpeechRecognition = (callback: SpeechRecognitionCallback): boolean => {
  if (!hasSpeechRecognition()) {
    console.error('Speech recognition not supported in this browser');
    return false;
  }
  
  recognition = getSpeechRecognition();
  if (!recognition) return false;
  
  // Configure the recognition
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  let finalTranscript = '';
  
  recognition.onresult = (event) => {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Call the callback with the current transcript
    callback(finalTranscript || interimTranscript);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    stopSpeechRecognition();
  };
  
  recognition.onend = () => {
    // Send final result when recognition ends
    if (finalTranscript) {
      callback(finalTranscript);
    }
  };
  
  // Start the recognition
  try {
    recognition.start();
    return true;
  } catch (e) {
    console.error('Failed to start speech recognition', e);
    return false;
  }
};

// Stop speech recognition
export const stopSpeechRecognition = (): void => {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      console.error('Error stopping speech recognition', e);
    }
    recognition = null;
  }
};
