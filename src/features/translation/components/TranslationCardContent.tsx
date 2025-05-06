import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@/theme";
import { format } from "date-fns";
import { Translation, UserMessage } from "../api/models";
import { Loader } from "@/components/common/Loader";
import { Colors } from "@/theme/colors";

interface TranslationCardContentProps {
  translation: Translation;
  userMessage: UserMessage;
}

export const TranslationCardContent: React.FC<TranslationCardContentProps> = ({
  translation,
  userMessage,
}) => {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  const timestamp = Date.now();
  const formattedDate = format(new Date(timestamp), "MMM d, yyyy h:mm a");
  const author = "AI Assistant";

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Text style={[typography.titleMedium, { color: colors.text.primary }]}>
          {translation.modality}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
          {formattedDate}
        </Text>

        <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
          original:{" "}
          {userMessage?.text != undefined ? userMessage.text : <Loader />}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            styles.text,
            { color: colors.text.primary },
          ]}
        >
          {translation.text}
        </Text>
        <Text style={[typography.labelSmall, { color: colors.text.secondary }]}>
          by {author}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.paper,
      borderRadius: 12,
      shadowColor: colors.neutral[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      maxWidth: "95%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
      backgroundColor: colors.background.paper,
    },
    content: {
      flex: 1,
      gap: 8,
      padding: 16,
      justifyContent: "space-between",
      backgroundColor: colors.background.paper,
    },
    text: {
      marginVertical: 4,
      color: colors.text.primary,
    },
    flipButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.background.paper,
    },
  });
