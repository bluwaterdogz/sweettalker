import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { Reframing } from "../api/models";
import { UserMessage } from "@/features/common-interpretation/api/models";
import { useAppDispatch } from "@/store";
import { updateReframing } from "../thunks";
import { CardContent } from "@/components/common";
import { EditableText } from "@/components/common/EditableText";

interface ReframingCardContentProps {
  reframing: Reframing;
  userMessage: UserMessage;
}

export const ReframingCardContent: React.FC<ReframingCardContentProps> = ({
  reframing,
  userMessage,
}) => {
  const dispatch = useAppDispatch();
  const { colors, typography } = useTheme();

  return (
    <CardContent>
      <View style={styles.content}>
        <Text
          style={[
            typography.bodyMedium,
            styles.textHeader,
            { color: colors.text.secondary },
          ]}
        >
          Reframing
        </Text>
        <Text
          style={[
            typography.bodyLarge,
            styles.text,
            { color: colors.text.primary },
          ]}
        >
          {reframing.text}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            styles.textHeader,
            { color: colors.text.secondary },
          ]}
        >
          Original
        </Text>
        <Text
          style={[
            typography.bodySmall,
            styles.text,
            { color: colors.text.primary },
          ]}
        >
          {userMessage?.text}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            styles.textHeader,
            { color: colors.text.secondary },
          ]}
        >
          Description
        </Text>
        <Text
          style={[
            typography.bodySmall,
            styles.text,
            { color: colors.text.primary },
          ]}
        >
          {reframing.description}
        </Text>
        <Text style={[typography.labelSmall, { color: colors.text.secondary }]}>
          Notes:
        </Text>
        <EditableText
          style={[typography.labelSmall, { color: colors.text.secondary }]}
          value={reframing.notes || ""}
          onChange={(text: string) =>
            dispatch(updateReframing({ id: reframing.id, notes: text }))
          }
        />
      </View>
    </CardContent>
  );
};

const styles = StyleSheet.create({
  textHeader: {},
  subHeader: {
    flexDirection: "column",
    gap: 8,
  },

  content: {
    gap: 8,
  },
  text: {
    padding: 8,

    lineHeight: 24,
  },
});
