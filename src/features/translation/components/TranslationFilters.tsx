import React from "react";
import { View, StyleSheet } from "react-native";
import { faRandom, faTrash } from "@fortawesome/free-solid-svg-icons";
import { setModalities, setConversationContext } from "../store/slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/common/components/Button";
import { TextInput } from "@/common/components/TextInput";
import { MultiSelect } from "@/common/components/MultiSelect";
import { ModalityLabel, ModalityIdentifier } from "../enums";
import { translationModalities } from "../consts";
import { Modality } from "../api/models";
import { useThemeBorders } from "@/features/common/hooks/useThemeBorders";

interface TranslationFiltersProps {
  mockUserMessage?: () => void;
  clearUserMessage?: () => void;
  logMessages?: () => void;
}

export const TranslationFilters: React.FC<TranslationFiltersProps> = ({
  mockUserMessage,
  clearUserMessage,
  logMessages,
}) => {
  const { modalities, conversationContext } = useAppSelector(
    (state) => state.translation
  );
  const dispatch = useAppDispatch();

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
        <MultiSelect<Modality>
          options={Object.values(translationModalities).map((modality) => ({
            label: modality.label,
            value: modality,
          }))}
          selectedValues={modalities}
          onSelectionChange={(itemValue) => dispatch(setModalities(itemValue))}
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
