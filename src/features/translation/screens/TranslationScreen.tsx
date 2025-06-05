import { View, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { TranslationList } from "../components/TranslationList";
import { TranslationControls } from "../components/TranslationControls";
import { ErrorBoundary } from "@/common/components/ErrorBoundary";
import { useAppRoute } from "@/app/navigation/hooks/useAppRoute";

export const TranslationScreen = () => {
  const { colors } = useTheme();
  const route = useAppRoute<"Translation">();
  const { conversationId, initialMessage } = route.params || {};
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.content}>
        <ErrorBoundary>
          <TranslationControls initialMessage={initialMessage} />
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationList conversationId={conversationId} />
        </ErrorBoundary>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    display: "flex",
    flex: 1,
  },
});
