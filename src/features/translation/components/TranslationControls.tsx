import React from "react";
import { View, StyleSheet } from "react-native";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { setInputText } from "../slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/common/Button";
import { translateText } from "../thunks";
import { TextInput } from "@/components/common/TextInput";
import { useToast } from "@/lib/toast";
import { useCallback } from "react";
import { VoiceToTextButton } from "@/lib/voice-to-text/components/VoiceToTextButton";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useTheme } from "@/theme";
import { common } from "@/theme/styles";

interface TranslationControlsProps {}

export const TranslationControls: React.FC<TranslationControlsProps> = () => {
  const { inputText, status, error } = useAppSelector(
    (state) => state.translation
  );

  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const handleTranslate = useCallback(async () => {
    try {
      await dispatch(translateText(inputText));
    } catch (error) {
      showToast({
        type: "error",
        message: error as string,
      });
    }
  }, [dispatch, showToast, inputText]);

  return (
    <View style={common.formContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={(text) => dispatch(setInputText(text))}
          placeholder="Enter text to translate"
          multiline
          style={{
            minHeight: 100,
            paddingRight: 40,
          }}
          textAlignVertical="top"
          clearInput={() => dispatch(setInputText(""))}
        />
      </View>

      <View style={common.row}>
        <VoiceToTextButton />

        <Button
          title="Translate"
          onPress={handleTranslate}
          icon={faLanguage}
          variant="outline"
          flex={1}
          loading={status === "loading"}
        />
      </View>
      <ErrorMessage error={error} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
  },
  clearButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 1,
  },
});
