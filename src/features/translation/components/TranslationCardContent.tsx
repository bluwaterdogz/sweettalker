import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "@/theme";
import { Translation } from "../api/models";
import { Colors } from "@/theme/colors";
import { useAppDispatch } from "@/store";
import { updateTranslationText } from "../thunks";
import { useToast } from "@/lib/toast";
import { useServices } from "@/services/context";
import { updateTranslation } from "../thunks";
import { EditableText, Loader, CardContent } from "@/components/common";
import { formatDate } from "@/lib/utils";
import { UserMessage } from "@/features/common-interpretation/api/models";

interface TranslationCardContentProps {
  translation: Translation;
  userMessage: UserMessage;
}

export const TranslationCardContent: React.FC<TranslationCardContentProps> = ({
  translation,
  userMessage,
}) => {
  const { colors, typography } = useTheme();
  const { showToast } = useToast();
  const { translationService } = useServices();
  const styles = getStyles(colors);
  const dispatch = useAppDispatch();

  const formattedDate = useMemo(
    () => formatDate(translation.createdAt),
    [translation.createdAt]
  );

  const onUpdateTranslationText = useCallback(
    async (text: string) => {
      try {
        await dispatch(
          updateTranslationText({
            id: translation.id,
            text: text,
          })
        );
        showToast({ type: "success", message: "Translation saved" });
      } catch (error) {
        console.error("Translation update error:", error);
      }
    },
    [translationService, translation.id, showToast]
  );

  return (
    <CardContent style={styles.content}>
      <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
        {formattedDate}
      </Text>
      <EditableText
        value={translation.text}
        onChange={onUpdateTranslationText}
      />
      <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
        Original:{" "}
        {userMessage?.text != undefined ? userMessage.text : <Loader />}
      </Text>
      <Text style={[typography.bodySmall, styles.text]}>
        Description: {translation.description}
      </Text>

      <Text style={[typography.labelSmall, { color: colors.text.secondary }]}>
        Notes:
      </Text>
      <EditableText
        style={[typography.labelSmall, { color: colors.text.secondary }]}
        value={translation.notes || ""}
        onChange={(text: string) =>
          dispatch(updateTranslation({ id: translation.id, notes: text }))
        }
      />
    </CardContent>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      display: "flex",
      gap: 8,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    description: {},
    text: {
      marginVertical: 4,
      color: colors.text.primary,
    },
  });
