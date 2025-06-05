import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMicrophone,
  faStop,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useVoiceRecognition } from "./hooks/useVoiceRecognition";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useConversation, Message } from "./hooks/useConversation";

interface VoiceToTextProps {
  onMessageComplete?: (message: Message) => void;
  speaker1Name?: string;
  speaker2Name?: string;
}

export const VoiceToText: React.FC<VoiceToTextProps> = ({
  onMessageComplete,
  speaker1Name = "Speaker 1",
  speaker2Name = "Speaker 2",
}) => {
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const { isRecording, results, error, startRecording, stopRecording } =
    useVoiceRecognition();

  const { speak, isSpeaking } = useTextToSpeech();

  const { messages, currentSpeaker, addMessage } = useConversation();

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  React.useEffect(() => {
    if (results.length > 0 && !isRecording) {
      const message = addMessage(results[0]);
      onMessageComplete?.(message);
    }
  }, [results, isRecording]);

  const handleRecordPress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const playMessage = (message: Message) => {
    speak(message.text);
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.speaker === "user1"
                ? styles.user1Bubble
                : styles.user2Bubble,
            ]}
          >
            <Text style={styles.speakerName}>
              {message.speaker === "user1" ? speaker1Name : speaker2Name}
            </Text>
            <Text style={styles.messageText}>{message.text}</Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playMessage(message)}
              disabled={isSpeaking}
            >
              <FontAwesomeIcon
                icon={faPlay}
                size={16}
                color={isSpeaking ? colors.error.primary : colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.controlsContainer}>
        <Text style={styles.currentSpeaker}>
          {t("Current Speaker")}:{" "}
          {currentSpeaker === "user1" ? speaker1Name : speaker2Name}
        </Text>
        <Animated.View
          style={[
            styles.recordButton,
            { transform: [{ scale: pulseAnim }] },
            isRecording && styles.recording,
          ]}
        >
          <TouchableOpacity
            onPress={handleRecordPress}
            style={styles.recordButtonInner}
          >
            <FontAwesomeIcon
              icon={isRecording ? faStop : faMicrophone}
              size={24}
              color={colors.background.primary}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  user1Bubble: {
    backgroundColor: "#E3F2FD",
    alignSelf: "flex-start",
  },
  user2Bubble: {
    backgroundColor: "#F3E5F5",
    alignSelf: "flex-end",
  },
  speakerName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  playButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
    padding: 4,
  },
  controlsContainer: {
    alignItems: "center",
  },
  currentSpeaker: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "bold",
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  recording: {
    backgroundColor: "#F44336",
  },
  recordButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#F44336",
    textAlign: "center",
    marginBottom: 8,
  },
});
