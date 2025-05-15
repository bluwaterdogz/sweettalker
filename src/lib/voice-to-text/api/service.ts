import { FirebaseService } from "@/services/firebase/service";
import { ApplicationError } from "@/services/base/errors";
const Voice = {} as any;

interface VoiceToTextParams {
  onResult: (text: string) => void;
}

export class VoiceToTextService {
  constructor() {}

  async voiceToText({ onResult }: VoiceToTextParams) {
    try {
      // Start listening
      await Voice.start("en-US");

      // Set up event listeners
      Voice.onSpeechResults = (e: any) => {
        if (e.value && e.value.length > 0) {
          const recognizedText = e.value[0];
          onResult(recognizedText);
        }
      };

      Voice.onSpeechError = (e: any) => {
        console.error("Speech recognition error:", e);
        throw new ApplicationError("Speech recognition failed");
      };

      return true;
    } catch (error) {
      console.error("Error starting voice input:", error);
      throw error;
    }
  }
}
