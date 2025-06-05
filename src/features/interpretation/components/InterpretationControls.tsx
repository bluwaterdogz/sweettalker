import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput } from "@/common/components/TextInput";
import { Button } from "@/common/components/Button";
import { common, styleConsts } from "@/common/styles";
import { useThemeBorders } from "../hooks/useThemeBorders";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface InterpretationControlsProps {
  children?: React.ReactNode;
  onInterpretation?: () => void;
  onMock?: () => void;
  loading?: boolean;
  input?: string;
  setInput?: (input: string) => void;
  buttonTitle?: string;
  direction?: string;
  direction2?: string;
}

export const InterpretationControls: React.FC<InterpretationControlsProps> = (
  props: InterpretationControlsProps
) => {
  const { typography, colors } = useTheme();
  const [inputTextState, setInputTextState] = useState("");
  const {
    children,
    onInterpretation,
    onMock,
    loading,
    input = inputTextState,
    setInput = setInputTextState,
    buttonTitle = "Interpret",
    direction = "What would you like help expressing?",
    direction2 = "Share what you're struggling to say and we'll help you reframe it...",
  } = props;

  const [status] = useState<"loading" | "idle">("idle");

  const inputThemeStyles = useThemeBorders();

  return (
    <View style={[common.formContainer, styles.container]}>
      <Text
        style={[
          typography.headingLarge,
          styles.direction,
          { color: colors.text.primary },
        ]}
      >
        {direction}
      </Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder={direction2}
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
  direction: {
    width: "80%",
    paddingBottom: 16,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 8,
  },

  button: {
    alignSelf: "flex-end",
  },
});
