import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Reframing } from "../api/models";
import { UserMessage } from "@/features/common/api/models";
import { useAppDispatch } from "@/store";
import { updateReframing } from "../store/thunks";
import {
  TitledBlock,
  ContentDropdown,
  EditableText,
} from "@/common/components";
import { useTranslation } from "react-i18next";
import { InterpretationCard } from "@/features/common/components/InterpretationCard";

interface ReframingCardProps {
  reframing: Reframing;
  userMessage: UserMessage;
  onUpdate: (id: string, data: Partial<Reframing>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ReframingCard: React.FC<ReframingCardProps> = ({
  reframing,
  userMessage,
  onUpdate,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { colors, typography } = useTheme();
  const { t } = useTranslation();

  return (
    <InterpretationCard
      item={reframing}
      onUpdate={onUpdate}
      onDelete={onDelete}
    >
      <View>
        <TitledBlock
          textStyles={[typography.bodyMedium]}
          title={t("reframing.title")}
          text={reframing.text}
        />
        <ContentDropdown>
          <TitledBlock title={t("common.original")} text={userMessage?.text} />
          <TitledBlock
            title={t("common.description")}
            text={reframing.description}
          />
          <Text
            style={[typography.labelSmall, { color: colors.text.secondary }]}
          >
            {t("common.notes")}
          </Text>
          <EditableText
            style={[typography.labelSmall, { color: colors.text.secondary }]}
            value={reframing.notes || ""}
            onChange={(text: string) =>
              dispatch(updateReframing({ id: reframing.id, notes: text }))
            }
          />
        </ContentDropdown>
      </View>
    </InterpretationCard>
  );
};
