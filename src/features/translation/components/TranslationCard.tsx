import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Edit, Translation } from "../api/models";
import { useAppDispatch } from "@/store";
import { updateTranslation } from "@/features/translation/store/thunks";
import {
  EditableText,
  TitledBlock,
  Slider,
  ContentDropdown,
} from "@/common/components";
import { UserMessage } from "@/features/common/api/models";
import { useTranslation } from "react-i18next";

import { formatTimeStamp } from "@/common/utils";
import { InterpretationCard } from "@/features/common/components/InterpretationCard";

interface TranslationCardProps {
  translation: Translation;
  userMessage: UserMessage;
  onUpdate: (id: string, data: Partial<Translation>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdateText: (id: string, text: string) => Promise<void>;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  translation,
  userMessage,
  onUpdate,
  onDelete,
  onUpdateText,
}) => {
  const { colors, typography } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const slides = useMemo(() => {
    return translation.priorEdits.map((edit) => {
      return {
        id: edit.id,
        title: formatTimeStamp(edit.createdAt),
        content: <EditSlideContent edit={edit} />,
      };
    });
  }, [translation.priorEdits]);

  return (
    <InterpretationCard
      key={translation.id}
      item={translation}
      onUpdate={onUpdate}
      onDelete={onDelete}
    >
      <View>
        <TitledBlock
          titleStyles={[
            typography.titleSmall,
            { color: colors.text.secondary },
          ]}
          title={t("translation.title")}
        >
          <EditableText
            value={translation.text}
            inputStyle={[typography.bodyLarge, { color: colors.text.primary }]}
            onChange={(text: string) => onUpdateText(translation.id, text)}
          />
        </TitledBlock>
        <ContentDropdown>
          <TitledBlock
            title={t("common.original")}
            text={`"${userMessage?.text ?? "..."}"`}
          />
          <TitledBlock
            title={t("common.description")}
            text={translation.description}
          />
          {slides.length > 0 && (
            <TitledBlock title={t("common.edits")}>
              <Slider slides={slides} />
            </TitledBlock>
          )}
          <TitledBlock
            titleStyles={[
              typography.labelMedium,
              { color: colors.text.secondary },
            ]}
            title={t("common.notes")}
          >
            <EditableText
              style={[typography.bodySmall, { color: colors.text.secondary }]}
              inputStyle={[
                typography.bodySmall,
                { color: colors.text.primary },
              ]}
              value={translation.notes || ""}
              onChange={(text: string) =>
                dispatch(updateTranslation({ id: translation.id, notes: text }))
              }
            />
          </TitledBlock>
        </ContentDropdown>
      </View>
    </InterpretationCard>
  );
};

const EditSlideContent = ({ edit }: { edit: Edit }) => {
  const { colors, typography } = useTheme();
  return (
    <View>
      <Text
        style={[
          typography.labelSmall,
          styles.slideDate,
          { color: colors.text.secondary },
        ]}
      >
        {formatTimeStamp(edit.createdAt)}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
        {edit.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  notesLabel: {
    marginBottom: 8,
  },
  slideDate: {
    marginBottom: 4,
  },
});
