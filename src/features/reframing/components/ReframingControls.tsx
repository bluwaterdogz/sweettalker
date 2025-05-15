import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "@/components/common/TextInput";
import { Button } from "@/components/common/Button";
import { useTheme } from "@/theme";
import { reframeText } from "../thunks";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearInputText, setInputText } from "../slice";
import { common } from "@/theme/styles";

export const ReframingControls: React.FC = () => {
  const { inputText, status } = useAppSelector((state) => state.reframing);
  const dispatch = useAppDispatch();

  const handleReframe = () => {
    if (inputText.trim()) {
      dispatch(reframeText(inputText));
      dispatch(clearInputText());
    }
  };

  return (
    <View style={[common.formContainer]}>
      <TextInput
        value={inputText}
        onChangeText={(text) => dispatch(setInputText(text))}
        placeholder="Enter text to reframe..."
        multiline={true}
        style={styles.input}
        textAlignVertical="top"
        clearInput={() => dispatch(clearInputText())}
      />
      <View style={common.row}>
        <Button
          title="Reframe"
          onPress={handleReframe}
          disabled={!inputText.trim()}
          flex={1}
          loading={status === "loading"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    minHeight: 100,
  },
  button: {
    alignSelf: "flex-end",
  },
});
