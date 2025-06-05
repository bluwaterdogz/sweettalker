import { useState, useCallback } from "react";
import Tts from "react-native-tts";

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      await Tts.speak(text, {
        androidParams: {
          KEY_PARAM_STREAM: "STREAM_MUSIC",
          KEY_PARAM_VOLUME: 1.0,
          KEY_PARAM_PAN: 0.0,
        },
        iosParams: {
          rate: 0.5,
          pitch: 1.0,
          volume: 1.0,
        },
      });
    } catch (error) {
      console.error("Error speaking text:", error);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      await Tts.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
  };
};
