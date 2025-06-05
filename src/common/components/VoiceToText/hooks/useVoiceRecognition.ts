import { useState, useCallback, useEffect } from "react";
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

export const useVoiceRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value) {
      setResults(e.value);
    }
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(e.error?.message || "An error occurred");
    stopRecording();
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setResults([]);
      await Voice.start("en-US");
      setIsRecording(true);
    } catch (e) {
      setError("Failed to start recording");
      console.error(e);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e) {
      setError("Failed to stop recording");
      console.error(e);
    }
  }, []);

  return {
    isRecording,
    results,
    error,
    startRecording,
    stopRecording,
  };
};

// {
//       id: "Conversation",
//       label: "Conversation",
//       content: (
//         <VoiceToText
//           onMessageComplete={console.log}
//           speaker1Name="John"
//           speaker2Name="Jane"
//         />
//       ),
//     },
