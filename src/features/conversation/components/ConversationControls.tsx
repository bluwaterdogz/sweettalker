import { useAppDispatch, useAppSelector } from "@/store";
import { sendMessage, updateConversationUserDetails } from "../store/thunks";
import { memo, useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Modal } from "@/common/components/Modal";
import { useUser } from "@/features/auth/hooks/useUser";
import { Button, TextInput, CircleButton } from "@/common/components";
import {
  faWandMagicSparkles,
  faChartLine,
  faShield,
  faShieldHeart,
  faSyncAlt,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useServices } from "@/services/context";
import { useConfirmation } from "@/common/components/Confirmation";
import { updateSettings } from "@/features/profile/store/thunks";
import { detectToxicPhrases } from "../utils/utils";
import { Message } from "@common/models/conversation/message";
import { common } from "@/common/styles";
import { useThemeBorders } from "@/common/hooks/useThemeBorders";
import { SentimentDisplay } from "./SentimentDisplay";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { useTypingStatus } from "@/features/conversation/hooks/useTypingStatus";
import { Conversation } from "@common/models/conversation/conversation";
import { Contact } from "@common/models/contacts/contact";
import { ConversationUserDetails } from "@common/models/conversation/conversation_user_details";
import { ResponseSuggestionDisplay } from "./ResponseSuggestionDisplay";

interface ConversationControlsProps {
  conversation: Conversation;
  messages: Message[];
  userMap: Map<string, Contact>;
  conversationUserDetails: ConversationUserDetails[];
  initialMessage?: string;
}

export const ConversationControls = memo(
  ({
    conversation,
    messages,
    conversationUserDetails,
    userMap,
    initialMessage = "",
  }: ConversationControlsProps) => {
    const { colors } = useTheme();
    const { user } = useUser();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [input, setInput] = useState(initialMessage);
    const navigation = useAppNavigation();
    const { safeChat } = useAppSelector((state) => state.settings);
    const confirm = useConfirmation();
    const { translationService, conversationService } = useServices();
    const [tooltipContent, setTooltipContent] =
      useState<React.ReactNode | null>(null);

    const submitMessage = async () => {
      dispatch(
        sendMessage({
          conversationId: conversation.id,
          input,
        })
      );
      setInput("");
    };

    const confirmSend = () => {
      confirm({
        title: t("chat.confirmSendTitle"),
        message:
          "There might be a better way to phrase that, do you want to try it out?",
        cancelText: "Rework",
        confirmText: "Send",
        onConfirm: () => {
          submitMessage();
        },
        onCancel: () => {
          goToTranslation();
        },
      });
    };

    const goToTranslation = () => {
      navigation.navigate("Translation", {
        conversationId: conversation.id,
        initialMessage: input,
      });
    };

    const handleSend = async () => {
      if (!input.trim() || !user?.uid) return;
      const shortToxic =
        input.split(" ").length < 5 && detectToxicPhrases(input);
      if (safeChat) {
        if (shortToxic) {
          confirmSend();
        } else {
          const result = await translationService.isMessageOptimal(input);
          if (result.score < 5) {
            confirmSend();
          } else {
            submitMessage();
          }
        }
      } else {
        submitMessage();
      }
    };

    const updateUserTypingStatus = useCallback(async () => {
      if (!conversation) return;
      dispatch(
        updateConversationUserDetails({
          conversationId: conversation.id,
          userId: user!.uid,
          isTyping: Date.now(),
        })
      );
    }, [conversation, conversationService]);

    const deleteUserTypingStatus = useCallback(async () => {
      if (!conversation) return;
      dispatch(
        updateConversationUserDetails({
          conversationId: conversation.id,
          userId: user!.uid,
          isTyping: 0,
        })
      );
    }, [conversation, conversationService]);

    useTypingStatus(input, {
      onTyping: () => updateUserTypingStatus(),
      onTypingEnd: () => deleteUserTypingStatus(),
      typingDebounceMs: 1000,
    });

    const showResponseSuggestions = useCallback(async () => {
      setTooltipContent(
        <ResponseSuggestionDisplay
          messages={messages}
          onSelectResponseSuggestion={(responseSuggestion) => {
            setInput(responseSuggestion.text);
            setTooltipContent(null);
          }}
          onClose={() => setTooltipContent(null)}
        />
      );
    }, [messages, user]);

    const showSentiment = useCallback(async () => {
      setTooltipContent(
        <SentimentDisplay
          messages={messages}
          toneColor={colors.listItemColors[0]}
          interestColor={colors.listItemColors[1]}
          onClose={() => setTooltipContent(null)}
        />
      );
    }, [messages, user]);

    const typingUsers = useMemo(() => {
      return conversationUserDetails
        .filter(
          (conversationUserDetails) =>
            conversationUserDetails.id !== user!.uid &&
            conversationUserDetails.isTyping + 1000 > Date.now()
        )
        .map((conversationUserDetails) => {
          const user = userMap.get(conversationUserDetails.id);
          return user;
        });
    }, [conversationUserDetails, userMap]);

    const activateSafeChat = useCallback(() => {
      dispatch(
        updateSettings({
          safeChat: !safeChat,
        })
      );
    }, [safeChat]);

    return (
      <View style={[styles.controlsContainer]}>
        <View style={[common.row, styles.row]}>
          {typingUsers.length > 0 && (
            <Text>
              {typingUsers
                .map((user) => user?.displayName || user?.email)
                .join(", ")}{" "}
              is typing...
            </Text>
          )}
        </View>
        <View style={[common.row, styles.row]}>
          <CircleButton
            icon={safeChat ? faShield : faShieldHeart}
            onPress={handleSend}
            onLongPress={activateSafeChat}
            color={safeChat ? colors.accent.primary : colors.text.secondary}
            backgroundColor={colors.background.primary}
          />
          <CircleButton
            icon={faChartLine}
            onPress={showSentiment}
            color={colors.text.secondary}
            backgroundColor={colors.background.primary}
          />
          <CircleButton
            icon={faBrain}
            onPress={showResponseSuggestions}
            color={colors.text.secondary}
            backgroundColor={colors.background.primary}
          />
          <CircleButton
            icon={faWandMagicSparkles}
            onPress={goToTranslation}
            color={colors.text.secondary}
            backgroundColor={colors.background.primary}
          />
          {/* <Pressable style={[buttonStyles, styles.controlButton]} onPress={() => {}, {
    backgroundColor: colors.background.primary,
  }}>
          <Icon icon={faMicrophone} size={18} color={colors.text.secondary} />
        </Pressable> */}
        </View>

        <View style={[common.row, styles.row]}>
          <Modal
            onClose={() => setTooltipContent(null)}
            visible={!!tooltipContent}
            transparent
            animationType="fade"
          >
            {tooltipContent}
          </Modal>
          <TextInput
            // inputRef={inputRef}
            multiline
            style={[styles.input]}
            inputStyle={[
              {
                color: colors.text.primary,
                borderColor: colors.neutral[300],
                borderWidth: 1,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder={t("chat.typeMessage")}
            placeholderTextColor={colors.neutral[500]}
          />
          <Button
            style={[styles.sendButton]}
            onPress={() => handleSend()}
            title={t("chat.send")}
            variant="primary"
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  controlsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    width: "100%",
    paddingBottom: 8,
  },
  row: {
    display: "flex",
    width: "100%",
  },
  controlButton: {
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {},
});

const good = [
  "I feel overwhelmed right now and need some quiet time to come back to myself.",
  "When you don't respond for a while, I feel anxious — I need reassurance we're okay.",
  "I really value feeling connected — could we check in more regularly?",
  "I feel hurt when plans change suddenly. Can we try to give each other more notice?",
  "I feel proud of us when we work through things with care.",
  "I need to feel emotionally safe to open up more — would you be willing to just listen without solving this?",
  "When you affirm me like that, I feel seen and cherished — I need more of that.",
  "I feel scared bringing this up, but I need to know we can be honest with each other.",
  "I'm needing more physical closeness lately — would you be open to more cuddle time?",
  "I feel dismissed when my feelings get brushed off. I need space to feel heard.",
  "It means a lot to me when you ask how I'm really doing — I feel loved in those moments.",
  "I'm noticing resentment building. I need to talk this through before it grows bigger.",
  "I feel grateful that we can be real with each other — it helps me relax.",
  "When I feel you pulling away, I get afraid. I need clarity, even if it's hard.",
  "I need more consistency to feel secure — can we talk about how to create that?",
  "I'm not blaming you, but I feel sad and I need a little more tenderness right now.",
  "I feel closest to you when we're laughing and playful — I want more of that.",
  "I feel like I'm doing more emotional labor lately — can we rebalance things?",
  "I need to know my needs matter to you, even when we disagree.",
  "I'm trying to show up better — could you tell me how you've been feeling lately?",
  "I need us to repair after conflict — not just move on.",
  "When you own your impact, I feel safer being vulnerable too.",
  "I need more clarity about where we're headed — it helps me invest fully.",
  "I feel stretched thin, and I need some support around the house this week.",
  "I need to know it's okay to not be okay sometimes around you.",
  "I feel more secure when our time together is protected from distractions.",
  "When you make space for my feelings, I feel deeply loved.",
  "I'm afraid this will push you away, but I need to share what's real for me.",
  "I feel relaxed when you're direct with me — I need honesty even if it's uncomfortable.",
  "I need us to pause and reflect when things feel off, rather than avoid them.",
  "I feel closest when we're emotionally present — can we plan for a check-in soon?",
  "I feel drained when conflict stays unresolved — I need closure to move forward.",
  "I feel secure when we have rituals — can we create some together?",
  "When you apologize sincerely, I feel deeply safe with you.",
  "I feel confused right now, and I need some help making sense of what's going on.",
  "I need to know my emotions won't be used against me.",
  "I feel more myself when I can express emotions freely around you.",
  "I'm not trying to fix you — I just want us to understand each other more deeply.",
  "I feel invisible when my boundaries aren't acknowledged — I need respect around them.",
  "I want to feel like we're a team, even when things are hard — can we work on that?",
];
const bad = [
  "Whatever. I don't care anymore.",
  "You always make everything about you.",
  "If you really loved me, you'd just know what I need.",
  "This is exactly why I never open up.",
  "You're too sensitive.",
  "Forget it — it doesn't matter.",
  "I shouldn't have to say this again.",
  "You never listen anyway, so why bother?",
  "Just leave me alone.",
  "Wow, I guess I can't feel anything without it being a problem.",
  "Fine, I'll just do everything myself as usual.",
  "You're acting crazy.",
  "It's not me, it's you.",
  "Whatever, I'm used to being disappointed.",
  "I don't need anything from you.",
  "There's no point talking — you never change.",
  "This is why I don't trust people.",
  "Why can't you just grow up?",
  "Don't worry, I'll just pretend like I'm fine.",
  "You're impossible to talk to.",
  "You wouldn't understand even if I told you.",
  "I'm just over this.",
  "I guess I was wrong to think you cared.",
  "I'll just keep my mouth shut like always.",
  "You're overreacting — it's not a big deal.",
  "God, why are you so needy?",
  "Don't expect anything from me right now.",
  "Whatever you say, boss.",
  "I'll remember this next time.",
  "I'm done trying.",
  "Clearly, I mean nothing to you.",
  "You're such a narcissist.",
  "I can't deal with your drama right now.",
  "You're just like everyone else.",
  "I guess I have to handle everything myself.",
  "You always twist my words.",
  "If I have to explain it, it's not worth it.",
  "Wow, you're really making this about you again?",
  "Can you just stop being so emotional?",
  "This is pointless. I don't even know why I try. ",
];
const test = [
  "I don't know what I feel right now, but something about this is upsetting me.", //Score: 6 — Emotion acknowledged, but need is unclear; invites confusion.
  "It's not that big of a deal, but I guess I just feel kind of left out.", //Score: 5 — Minimizing tone undercuts emotional honesty.
  "Sometimes I wonder if we're on the same page — I wish I knew what you were thinking.", //Score: 7 — Slight indirectness, but curious and vulnerable.
  "I don't want to make this an issue, but I felt kind of ignored yesterday.", //Score: 6 — Apologetic phrasing weakens emotional impact.
  "It's frustrating when I feel like I'm not being heard, even if you didn't mean to.", //Score: 7 — Emotion well expressed, but slightly passive tone.
  "I guess I just expected you to check in, and when you didn't, I got in my head.", //Score: 6 — Personal responsibility is there, but the need isn't clearly voiced.
  "I care about you and I want this to work, but I don't know how to say what I need.", //Score: 7 — Emotionally honest but lacks clarity on actual need.
  "I've been holding this in for a while — I don't know if it's the right time, but I feel distance between us.", //Score: 6 — Vague and avoidant, but shows effort to connect.
  "I don't want to be dramatic, but I've felt a little abandoned lately.", //Score: 5 — Emotion is real, but phrasing is self-shaming.
  "You probably didn't mean to hurt me, but I felt kind of small after what you said.",
];
