import React from "react";
import { View, StyleSheet } from "react-native";
import { faRandom, faTrash } from "@fortawesome/free-solid-svg-icons";
import { setSelectedModalities, setConversationContext } from "../slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/common/Button";
import { TextInput } from "@/components/common/TextInput";
import { MultiSelect } from "@/components/common/MultiSelect";
import { ModalityLabel, ModalityIdentifier } from "../enums";

interface TranslationDrawerControlsProps {
  mockUserMessage?: () => void;
  clearUserMessage?: () => void;
  logMessages?: () => void;
}

export const TranslationDrawerControls: React.FC<
  TranslationDrawerControlsProps
> = ({ mockUserMessage, clearUserMessage, logMessages }) => {
  const { selectedModalities, conversationContext } = useAppSelector(
    (state) => state.translation
  );
  const dispatch = useAppDispatch();

  const modalityOptions = Object.values(ModalityLabel).map((label) => ({
    label,
    value: ModalityIdentifier[label as keyof typeof ModalityIdentifier],
  }));

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          value={conversationContext}
          onChangeText={(text) => dispatch(setConversationContext(text))}
          placeholder="Describe the conversation context"
          clearInput={() => dispatch(setConversationContext(""))}
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
        {clearUserMessage && (
          <Button
            title="Clear"
            onPress={clearUserMessage}
            icon={faTrash}
            variant="secondary"
            flex={1}
          />
        )}
        {mockUserMessage && (
          <Button
            title="Mock Message"
            onPress={mockUserMessage}
            icon={faRandom}
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
  modalitySelect: {},
});
