import React, { useCallback, useMemo } from "react";
import { Translation } from "../api/models";
import { useServices } from "@/services/context";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { UserMessage } from "@/features/common/api/models";
import { keyBy } from "lodash";
import { InterpretationList } from "@/features/common/components/InterpretationList";
import { updateTranslation, updateTranslationText } from "../store/thunks";
import { deleteTranslation } from "../store/thunks";
import { useAppDispatch } from "@/store";
import { useToast } from "@/common/features/Toast";
import { TranslationCard } from "./TranslationCard";

interface PopulatedTranslation extends Translation {
  userMessage: UserMessage;
}

export const TranslationList = () => {
  const { translationService } = useServices();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const {
    result: translations,
    loading: loadingTranslations,
    error: translationsError,
  } = useSubscribeFirestore<Translation[]>((...args) =>
    translationService.subscribe(...args)
  );

  const {
    result: userMessages,
    loading: loadingUserMessages,
    error: userMessagesError,
  } = useSubscribeFirestore<UserMessage[]>((...args) =>
    translationService.subscribeToUserMessages(...args)
  );

  const userMessagesHashmap = useMemo(() => {
    return keyBy(userMessages, "id");
  }, [userMessages]);

  const populatedTranslations: PopulatedTranslation[] = useMemo(
    () =>
      (translations || []).map((t) => ({
        ...t,
        userMessage: userMessagesHashmap[t.userMessageId],
      })),
    [translations, userMessagesHashmap]
  );

  const onUpdateTranslation = useCallback(
    async (id: string, data: Partial<Translation>) => {
      await dispatch(
        updateTranslation({
          id,
          ...data,
        })
      );
      showToast({ type: "success", message: "Translation saved" });
    },
    [translationService, showToast]
  );

  const onDeleteTranslation = useCallback(
    async (id: string) => {
      await dispatch(deleteTranslation(id));
      showToast({ type: "success", message: "Translation deleted" });
    },
    [dispatch, showToast]
  );

  const onUpdateTranslationText = useCallback(
    async (id: string, text: string) => {
      await dispatch(
        updateTranslationText({
          id,
          text: text,
        })
      );
      showToast({ type: "success", message: "Translation saved" });
    },
    [translationService, showToast]
  );

  return (
    <InterpretationList<PopulatedTranslation>
      searchKeys={[
        "text",
        "description",
        "notes",
        "edits.text",
        "title",
        "userMessage.text",
      ]}
      items={populatedTranslations}
      renderItem={(item) => (
        <TranslationCard
          translation={item}
          userMessage={userMessagesHashmap[item.userMessageId]}
          onUpdate={onUpdateTranslation}
          onDelete={onDeleteTranslation}
          onUpdateText={onUpdateTranslationText}
        />
      )}
    />
  );
};
