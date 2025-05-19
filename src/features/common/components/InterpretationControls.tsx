import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "@/common/components/TextInput";
import { Button } from "@/common/components/Button";
import { common } from "@/common/styles";
import { useThemeBorders } from "../hooks/useThemeBorders";

interface InterpretationControlsProps {
  children?: React.ReactNode;
  onInterpretation?: () => void;
  onMock?: () => void;
  loading?: boolean;
  input?: string;
  setInput?: (input: string) => void;
  buttonTitle?: string;
}

export const InterpretationControls: React.FC<InterpretationControlsProps> = (
  props: InterpretationControlsProps
) => {
  const [inputTextState, setInputTextState] = useState("");
  const {
    children,
    onInterpretation,
    onMock,
    loading,
    input = inputTextState,
    setInput = setInputTextState,
    buttonTitle = "Interpret",
  } = props;

  const [status] = useState<"loading" | "idle">("idle");

  const inputThemeStyles = useThemeBorders();

  return (
    <View style={[common.formContainer, styles.container]}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter text to reframe..."
        style={inputThemeStyles}
        textAlignVertical="top"
        multiline={true}
        clearInput={() => setInput("")}
      />
      <View style={common.row}>
        <Button
          title={buttonTitle}
          onPress={onInterpretation}
          style={inputThemeStyles}
          disabled={!input.trim()}
          flex={1}
          loading={status === "loading"}
        />
        <Button
          title="Mock"
          style={inputThemeStyles}
          onPress={onMock}
          flex={1}
        />
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },

  button: {
    alignSelf: "flex-end",
  },
});
