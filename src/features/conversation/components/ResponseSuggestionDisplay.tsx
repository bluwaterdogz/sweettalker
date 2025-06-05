import { useTheme } from "@/common/theme/hooks/useTheme";
import { ResponseSuggestion } from "@common/models/chat/response-suggestion";
import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";

interface ResponseSuggestionDisplayProps {
  responseSuggestions: ResponseSuggestion[];
  onSelectResponseSuggestion: (responseSuggestion: ResponseSuggestion) => void;
}
export const ResponseSuggestionDisplay = ({
  responseSuggestions,
  onSelectResponseSuggestion,
}: ResponseSuggestionDisplayProps) => {
  const { colors, typography } = useTheme();
  return (
    <FlatList
      data={responseSuggestions}
      renderItem={({ item }) => (
        <View key={item.text} style={styles.responseSuggestionContainer}>
          <Pressable
            style={[
              styles.responseSuggestion,
              { borderColor: colors.text.primary },
            ]}
            onPress={() => onSelectResponseSuggestion(item)}
          >
            <Text style={typography.bodyMedium}>{item.text}</Text>
          </Pressable>
          <Text style={typography.bodySmall}>{item.description}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  responseSuggestion: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  responseSuggestionContainer: {
    marginBottom: 16,
  },
});
