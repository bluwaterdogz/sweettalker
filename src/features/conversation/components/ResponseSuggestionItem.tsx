import { Pressable, View, Text, StyleSheet } from "react-native";
import { Pill } from "@/common/components/Pill";
import { ResponseSuggestion } from "@common/models/conversation/response-suggestion";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useState } from "react";
import { EditableText } from "@/common/components/EditableText";

interface ResponseSuggestionItemProps {
  item: ResponseSuggestion;
  onSelectResponseSuggestion: (item: ResponseSuggestion) => void;
}
export const ResponseSuggestionItem = ({
  item,
  onSelectResponseSuggestion,
}: ResponseSuggestionItemProps) => {
  const { colors, typography } = useTheme();
  const [text, setText] = useState(item.text);

  return (
    <View key={item.text} style={styles.responseSuggestionContainer}>
      <Pressable
        style={[
          styles.responseSuggestion,
          { borderColor: colors.neutral[200] },
        ]}
        onPress={() =>
          onSelectResponseSuggestion({
            ...item,
            text,
          })
        }
      >
        {item.tones && item.tones.length > 0 && (
          <View style={styles.pillContainer}>
            {item.tones?.map((tone) => (
              <Pill
                key={tone}
                isSelected={true}
                showX={false}
                color={
                  colors.listItemColors[
                    Math.floor(Math.random() * colors.listItemColors.length)
                  ]
                }
                label={tone}
                value={tone}
                style={styles.pill}
              />
            ))}
          </View>
        )}
        <EditableText
          inputStyle={[
            typography.titleSmall,
            {
              color: colors.text.primary,
            },
          ]}
          value={text}
          onChange={setText}
        />
        <Text
          style={[
            typography.bodyMedium,
            {
              color: colors.text.primary,
            },
          ]}
        >
          {item.description}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  responseSuggestion: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 16,
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  responseSuggestionContainer: {
    marginBottom: 16,
  },
  pillContainer: {
    // flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // gap: 8,
  },
  pill: {
    marginRight: 8,
    marginBottom: 8,
  },
});
