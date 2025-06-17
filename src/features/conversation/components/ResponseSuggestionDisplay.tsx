import { useTheme } from "@/common/theme/hooks/useTheme";
import { ResponseSuggestion } from "@common/models/conversation/response-suggestion";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Button, Icon, Loader } from "@/common/components";
import { ResponseSuggestionItem } from "./ResponseSuggestionItem";
import { common } from "@/common/styles";
import { faRecycle } from "@fortawesome/free-solid-svg-icons";
import { usePromise } from "@/common/hooks/usePromise";
import { useUser } from "@/features/auth/hooks/useUser";
import { useServices } from "@/services/context";
import { Message } from "@common/models/conversation";

interface ResponseSuggestionDisplayProps {
  messages: Message[];
  onSelectResponseSuggestion: (responseSuggestion: ResponseSuggestion) => void;
  onClose: () => void;
}
export const ResponseSuggestionDisplay = ({
  messages,
  onSelectResponseSuggestion,
  onClose,
}: ResponseSuggestionDisplayProps) => {
  const { user } = useUser();
  const { typography, colors } = useTheme();
  const { translationService } = useServices();

  const {
    data: responseSuggestions,
    isLoading,
    error,
    refresh,
  } = usePromise<ResponseSuggestion[]>(async () => {
    return await translationService.getResponseSuggestions(
      messages,
      user!.uid,
      {}
    );
  });

  return (
    <View>
      <Text
        style={[
          typography.headingMedium,
          {
            color: colors.text.primary,
          },
        ]}
      >
        Response Suggestions
      </Text>
      <View style={styles.list}>
        {isLoading ? (
          <View style={common.row}>
            <Loader />
          </View>
        ) : (
          responseSuggestions
            ?.sort((x) => x.score)
            .reverse()
            .map((item) => (
              <ResponseSuggestionItem
                item={item}
                key={item.text}
                onSelectResponseSuggestion={onSelectResponseSuggestion}
              />
            ))
        )}
      </View>
      <View style={common.row}>
        {onClose != null && (
          <Button variant="outline" title="Close" onPress={onClose} />
        )}
        {refresh != null && (
          <Button
            variant="outline"
            title={
              <Icon icon={faRecycle} size={18} color={colors.text.secondary} />
            }
            onPress={refresh}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
    // gap: 16,
  },
});
