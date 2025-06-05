import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

interface TruncatedTextProps extends TextProps {
  text: string;
  numberOfLines?: number;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  numberOfLines = 1,
  style,
  ...props
}) => {
  return (
    <Text
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      {...props}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
});
