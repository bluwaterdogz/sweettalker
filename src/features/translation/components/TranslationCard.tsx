import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { Translation } from "../api/models";
import { Colors } from "@/theme/colors";
import { useAppDispatch } from "@/store";

import { useToast } from "@/lib/toast";
import { useServices } from "@/services/context";
import { updateTranslation } from "../thunks";
import { InterpretationCardHeader } from "@/features/common-interpretation/components/InterpretationCardHeader";
import { UserMessage } from "@/features/common-interpretation/api/models";
import { TranslationCardContent } from "./TranslationCardContent";

interface TranslationCardProps {
  translation: Translation;
  userMessage: UserMessage;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  translation,
  userMessage,
}) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { translationService } = useServices();
  const styles = getStyles(colors);
  const dispatch = useAppDispatch();

  const onUpdateTranslation = useCallback(
    async (id: string, data: Partial<Translation>) => {
      try {
        await dispatch(
          updateTranslation({
            id,
            ...data,
          })
        );
        showToast({ type: "success", message: "Translation saved" });
      } catch (error) {
        console.error("Rating error:", error);
      }
    },
    [translationService, showToast]
  );

  return (
    <View>
      <InterpretationCardHeader
        title={translation.title || translation.modality.label}
        entity={translation}
        updateInterpretation={onUpdateTranslation}
      />
      <TranslationCardContent
        translation={translation}
        userMessage={userMessage}
      />
    </View>
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
  });
