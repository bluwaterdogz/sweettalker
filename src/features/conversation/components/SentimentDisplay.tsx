import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedProgressBar } from "@/common/components/AnimatedProgressBar";
import { ConversationSentiment } from "@common/models/chat/conversation-sentiment";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface SentimentDisplayProps {
  sentiment: ConversationSentiment;
  toneColor: string;
  interestColor: string;
}

const SentimentDisplay: React.FC<SentimentDisplayProps> = ({
  sentiment,
  toneColor,
  interestColor,
}) => {
  const { typography } = useTheme();
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
  } = sentiment;
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={[styles.title, typography.headingSmall]}>Tone</Text>
          <Text style={styles.score}>
            {toneScore.toFixed(1).replace(".", ",")}
          </Text>
        </View>
        <AnimatedProgressBar
          value={toneScore / 10}
          color={toneColor}
          label={toneLabel}
          style={{ marginTop: 8, marginBottom: 8 }}
        />
        <Text style={styles.description}>{toneExplanation}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={[styles.title, typography.headingSmall]}>
            Romantic Interest
          </Text>
          <Text style={styles.score}>
            {interestScore.toFixed(1).replace(".", ",")}
          </Text>
        </View>
        <AnimatedProgressBar
          value={interestScore / 10}
          color={interestColor}
          label={interestLabel}
          style={{ marginTop: 8, marginBottom: 8 }}
        />
        <Text style={styles.description}>{interestExplanation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
  card: {
    borderRadius: 24,
    marginHorizontal: 8,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
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

export default SentimentDisplay;
