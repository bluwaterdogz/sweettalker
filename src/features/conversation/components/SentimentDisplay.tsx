import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Loader } from "@/common/components";
import { AnimatedProgressBar } from "@/common/components/AnimatedProgressBar";
import { ConversationSentiment } from "@common/models/conversation/conversation-sentiment";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Icon } from "@/common/components/Icon";
import {
  faArrowTrendDown,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { Message } from "@common/models/conversation";
import { usePromise } from "@/common/hooks/usePromise";
import { useServices } from "@/services/context";
import { useUser } from "@/features/auth/hooks/useUser";
import { common } from "@/common/styles";

interface SentimentDisplayProps {
  messages: Message[];
  toneColor: string;
  interestColor: string;
  onClose: () => void;
}

export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({
  messages,
  toneColor,
  interestColor,
  onClose,
}) => {
  const { typography, colors } = useTheme();
  const { translationService } = useServices();
  const { user } = useUser();
  const getTrendIcon = (trend: "rising" | "falling" | "steady") => {
    switch (trend) {
      case "rising":
        return faArrowTrendUp;
      case "falling":
        return faArrowTrendDown;
      default:
        return null;
    }
  };

  const {
    data: sentiment,
    isLoading,
    error,
    refresh,
  } = usePromise<ConversationSentiment>(async () => {
    return await translationService.getConversationSentiment(
      messages,
      user!.uid
    );
  });

  const {
    toneScore,
    toneLabel,
    usersAttachmentStyle,
    interestScore,
    interestLabel,
    toneTrend,
    interestTrend,
    toneTrendConfidence,
    interestTrendConfidence,
    toneExplanation,
    interestExplanation,
    attachmentStyleExplanation,
  } = sentiment ?? {
    toneScore: 0,
    interestScore: 0,
    toneTrend: "steady",
    interestTrend: "steady",
    toneTrendConfidence: 0,
    interestTrendConfidence: 0,
    toneExplanation: "",
  };
  return (
    <View style={styles.root}>
      <Text
        style={[
          typography.headingMedium,
          {
            color: colors.text.primary,
          },
        ]}
      >
        Conversation Sentiment
      </Text>
      {isLoading || sentiment == null ? (
        <View style={common.row}>
          <Loader />
        </View>
      ) : (
        <View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text
                style={[
                  styles.title,
                  typography.headingSmall,
                  {
                    color: colors.text.primary,
                  },
                ]}
              >
                Tone
              </Text>
              {toneTrend !== "steady" && (
                <Icon
                  icon={getTrendIcon(toneTrend)!}
                  size={32}
                  color={
                    toneTrend === "rising"
                      ? colors.success.primary
                      : colors.error.primary
                  }
                  style={styles.trendIcon}
                />
              )}
              <Text
                style={[
                  styles.score,
                  {
                    color: colors.text.primary,
                  },
                ]}
              >
                {toneScore}/10
              </Text>
            </View>
            <AnimatedProgressBar
              value={toneScore / 10}
              color={toneColor}
              label={toneLabel}
              style={{ marginTop: 8, marginBottom: 8 }}
            />
            <Text
              style={[
                styles.description,
                {
                  color: colors.text.primary,
                },
              ]}
            >
              {toneExplanation}
            </Text>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text
                style={[
                  styles.title,
                  typography.headingSmall,
                  {
                    color: colors.text.primary,
                  },
                ]}
              >
                Romantic Interest
              </Text>
              {interestTrend !== "steady" && (
                <Icon
                  icon={getTrendIcon(interestTrend)!}
                  size={32}
                  color={
                    interestTrend === "rising"
                      ? colors.success.primary
                      : colors.error.primary
                  }
                  style={styles.trendIcon}
                />
              )}
              <Text
                style={[
                  styles.score,
                  {
                    color: colors.text.primary,
                  },
                ]}
              >
                {interestScore}/10
              </Text>
            </View>
            <AnimatedProgressBar
              value={interestScore / 10}
              color={interestColor}
              label={interestLabel}
              style={{ marginTop: 8, marginBottom: 8 }}
            />
            <Text style={[styles.description, { color: colors.text.primary }]}>
              {interestExplanation}
            </Text>
          </View>
        </View>
      )}

      <View style={common.row}>
        <Button variant="outline" title="Close" onPress={onClose} />
        <Button variant="outline" title="Refresh" onPress={refresh} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 0,
  },
  header: {
    fontSize: 36,
    fontWeight: "700",
    marginTop: 32,
    marginBottom: 24,
    marginLeft: 16,
    color: "#111",
    lineHeight: 40,
  },
  trendIcon: {
    marginLeft: "auto",
    marginRight: 8,
  },
  card: {
    marginHorizontal: 8,
    marginBottom: 18,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    paddingHorizontal: 4,
    paddingVertical: 24,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  score: {
    fontSize: 28,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "400",
    lineHeight: 22,
  },
});
