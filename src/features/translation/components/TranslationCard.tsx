import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useAppDispatch } from "@/store";
import { updateTranslation } from "@/features/translation/store/thunks";
import {
  EditableText,
  TitledBlock,
  ContentDropdown,
  CardContent,
} from "@/common/components";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Translation } from "@common/models/translation/translation";
import { UserMessage } from "@common/models/interpretation/user-message";
import { TranslationCardHeader } from "./TranslationCardHeader";

interface TranslationCardProps {
  translation: Translation;
  userMessage: UserMessage;
  onUpdate: (id: string, data: Partial<Translation>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdateText: (id: string, text: string) => Promise<void>;
  onInsert?: (translation: Translation) => void;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  translation,
  userMessage,
  onUpdate,
  onDelete,
  onUpdateText,
  onInsert,
}) => {
  const { colors, typography } = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  // const slides = useMemo(() => {
  //   return translation.priorEdits.map((edit) => {
  //     return {
  //       id: edit.id,
  //       title: formatTimeStamp(edit.createdAt),
  //       content: <EditSlideContent edit={edit} />,
  //     };
  //   });
  // }, [translation.priorEdits]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
        },
      ]}
    >
      <TranslationCardHeader
        title={translation.title || "Translation"}
        entity={translation}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onInsert={onInsert}
      />
      <CardContent
        style={[styles.content, { backgroundColor: colors.background.primary }]}
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
              inputStyle={[
                typography.bodyLarge,
                { color: colors.text.primary },
              ]}
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
            {/* {slides.length > 0 && (
            <TitledBlock title={t("common.edits")}>
              <Slider slides={slides} />
            </TitledBlock>
          )} */}
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
                  dispatch(
                    updateTranslation({ id: translation.id, notes: text })
                  )
                }
              />
            </TitledBlock>
          </ContentDropdown>
        </View>
      </CardContent>
    </View>
  );
};

// const EditSlideContent = ({ edit }: { edit: Edit }) => {
//   const { colors, typography } = useTheme();
//   return (
//     <View>
//       <Text
//         style={[
//           typography.labelSmall,
//           styles.slideDate,
//           { color: colors.text.secondary },
//         ]}
//       >
//         {formatTimeStamp(edit.createdAt)}
//       </Text>
//       <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
//         {edit.text}
//       </Text>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    gap: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    display: "flex",
    gap: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  notesLabel: {
    marginBottom: 8,
  },
  slideDate: {
    marginBottom: 4,
  },
});
