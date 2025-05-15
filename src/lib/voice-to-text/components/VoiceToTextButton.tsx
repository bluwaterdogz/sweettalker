import { Button } from "@/components/common";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { useCallback } from "react";
import { startVoiceInput } from "../thunks";
import { stopVoiceInput } from "../thunks";

export const VoiceToTextButton = () => {
  const isListening = useAppSelector((state) => state.voiceToText.isListening);
  const dispatch = useAppDispatch();

  const handleVoiceInput = useCallback(async () => {
    if (isListening) {
      await dispatch(stopVoiceInput());
    } else {
      await dispatch(startVoiceInput());
    }
  }, [dispatch, isListening]);

  return (
    <Button
      title={isListening ? "Stop" : "Speak"}
      onPress={handleVoiceInput}
      icon={faMicrophone}
      variant={isListening ? "outline" : "secondary"}
      flex={1}
    />
  );
};
