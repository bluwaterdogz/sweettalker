import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateRelationalPrompt } from "./utils";
import { RelationalContext, Model } from "./enums";
import { validateUserMessage } from "./api/validation";
import type { Moderation } from "./api/models";
import { setInputText } from "./slice";
import { ThunkAPI } from "@/store/types";

// const enrichedTranslations = [
//   {
//     createdAt: undefined,
//     description:
//       "This response focuses on expressing feelings and needs without blaming the other person, fostering understanding and connection.",
//     favorite: undefined,
//     modality: "Nonviolent Communication (NVC)",
//     model: "gpt-3.5-turbo",
//     rating: undefined,
//     text: undefined,
//     userMessageId: undefined,
//   },
//   {
//     createdAt: undefined,
//     description:
//       "This response encourages empathy and connection by expressing a need for validation and understanding from the partner.",
//     favorite: undefined,
//     modality: "Imago Relationship Therapy (Imago)",
//     model: "gpt-3.5-turbo",
//     rating: undefined,
//     text: undefined,
//     userMessageId: undefined,
//   },
//   {
//     createdAt: undefined,
//     description:
//       "This response invites open communication and exploration of the listener's perspective, fostering mutual understanding and emotional safety.",
//     favorite: undefined,
//     modality: "Authentic Relating (AR)",
//     model: "gpt-3.5-turbo",
//     rating: undefined,
//     text: undefined,
//     userMessageId: undefined,
//   },
// ];

export const validateMessage = createAsyncThunk<Moderation, string, ThunkAPI>(
  "translation/validateMessage",
  async (message: string, { rejectWithValue, extra: { services } }) => {
    try {
      return await validateUserMessage(message, services.translationService);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Validation failed"
      );
    }
  }
);

export const translateText = createAsyncThunk<any, string, ThunkAPI>(
  "translation/translateText",
  async (inputText: string, { rejectWithValue, extra: { services } }) => {
    try {
      const model = Model.Gpt3_5;

      // Validate the message first
      const validationResult = await validateUserMessage(
        inputText,
        services.translationService
      );
      if (validationResult.isFlagged) {
        return rejectWithValue("Message failed validation");
      }

      const prompt = generateRelationalPrompt({
        userMessage: inputText,
        model,
        context: RelationalContext.Romantic,
      });

      const translations = await services.translationService.translateText({
        model,
        input: prompt,
      });

      // Persist the user message and its translations together
      const enrichedTranslations =
        await services.translationService.persistUserMessageAndTranslations(
          inputText,
          translations,
          { model }
        );

      return enrichedTranslations;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

const Voice = {} as any;

export const startVoiceInput = createAsyncThunk(
  "translation/startVoiceInput",
  async (_, { dispatch }) => {
    try {
      // Start listening
      await Voice.start("en-US");

      // Set up event listeners
      Voice.onSpeechResults = (e: any) => {
        if (e.value && e.value.length > 0) {
          const recognizedText = e.value[0];
          dispatch(setInputText(recognizedText));
        }
      };

      Voice.onSpeechError = (e: any) => {
        console.error("Speech recognition error:", e);
        throw new Error("Speech recognition failed");
      };

      return true;
    } catch (error) {
      console.error("Error starting voice input:", error);
      throw error;
    }
  }
);

export const stopVoiceInput = createAsyncThunk(
  "translation/stopVoiceInput",
  async () => {
    try {
      await Voice.stop();
      Voice.removeAllListeners();
      return true;
    } catch (error) {
      console.error("Error stopping voice input:", error);
      throw error;
    }
  }
);
