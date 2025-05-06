import { View, StyleSheet } from "react-native";
import {
  faLanguage,
  faRandom,
  faTrash,
  faCode,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import {
  setInputText,
  setSelectedModalities,
  setConversationContext,
} from "../slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/common/Button";
import { stopVoiceInput, startVoiceInput } from "../thunks";
import { TextInput } from "@/components/common/TextInput";
import { MultiSelect } from "@/components/common/MultiSelect";
import { ModalityLabel, ModalityIdentifier } from "../enums";

interface TranslationControlsProps {
  handleTranslate?: () => void;
  mockUserMessage?: () => void;
  clearUserMessage?: () => void;
  logMessages?: () => void;
}

export const TranslationControls = (props: TranslationControlsProps) => {
  const { handleTranslate, mockUserMessage, clearUserMessage, logMessages } =
    props;

  const { inputText, isListening, selectedModalities, conversationContext } =
    useAppSelector((state) => state.translation);
  const dispatch = useAppDispatch();

  const handleVoiceInput = async () => {
    if (isListening) {
      await dispatch(stopVoiceInput());
    } else {
      await dispatch(startVoiceInput());
    }
  };

  const modalityOptions = Object.values(ModalityLabel).map((label) => ({
    label,
    value: ModalityIdentifier[label as keyof typeof ModalityIdentifier],
  }));

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          value={inputText}
          onChangeText={(text) => dispatch(setInputText(text))}
          placeholder="Enter text to translate"
          multiline
          style={styles.multilineInput}
        />
      </View>

      <View>
        <TextInput
          value={conversationContext}
          onChangeText={(text) => dispatch(setConversationContext(text))}
          placeholder="Describe the conversation context"
        />
      </View>

      <View style={styles.modalitySelect}>
        <MultiSelect
          options={modalityOptions}
          selectedValues={selectedModalities}
          onSelectionChange={(values) =>
            dispatch(setSelectedModalities(values))
          }
          placeholder="Select modalities"
        />
      </View>

      <View style={styles.row}>
        <Button
          title={isListening ? "Stop" : "Speak"}
          onPress={handleVoiceInput}
          icon={faMicrophone}
          variant={isListening ? "primary" : "secondary"}
          flex={1}
        />

        {handleTranslate != null && (
          <Button
            title="Translate"
            onPress={handleTranslate}
            icon={faLanguage}
            variant="secondary"
            flex={1}
          />
        )}

        {clearUserMessage != null && (
          <Button
            title="Clear"
            onPress={clearUserMessage}
            icon={faTrash}
            variant="secondary"
            flex={1}
          />
        )}
      </View>

      <View style={styles.row}>
        {mockUserMessage != null && (
          <Button
            title="Mock Message"
            onPress={mockUserMessage}
            icon={faRandom}
            variant="secondary"
            flex={1}
          />
        )}

        {logMessages != null && (
          <Button
            title="Log"
            onPress={logMessages}
            icon={faCode}
            variant="secondary"
            flex={1}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalitySelect: {},
});
