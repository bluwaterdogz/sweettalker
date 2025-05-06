import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "./Card";
import { useTheme } from "@/theme";

export const CardExample: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Basic Card */}
      <Card
        title="Basic Card"
        description="This is a basic card with a title and description. It's not clickable."
      />

      {/* Clickable Card */}
      <Card
        title="Clickable Card"
        description="This card is clickable and will trigger an action when pressed."
        onPress={() => console.log("Card pressed!")}
      />

      {/* Custom Styled Card */}
      <Card
        title="Custom Styled Card"
        description="This card has custom styling applied to it."
        style={{
          backgroundColor: colors.primary.light,
          marginVertical: 16,
        }}
        titleStyle={{ color: colors.text.light }}
        descriptionStyle={{ color: colors.text.light }}
      />

      {/* Card with Long Text */}
      <Card
        title="Card with Long Text"
        description="This is a card with a longer description that will be truncated after two lines. The title will be truncated after one line. This demonstrates the text truncation behavior of the card component."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
