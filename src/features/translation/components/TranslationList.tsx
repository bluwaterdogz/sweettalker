import React, { useCallback, useMemo, useState } from "react";
import { Translation } from "@common/models/translation/translation";
import { useServices } from "@/services/context";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { UserMessage } from "@common/models/interpretation/user-message";
import { keyBy } from "lodash";
import { updateTranslation, updateTranslationText } from "../store/thunks";
import { deleteTranslation } from "../store/thunks";
import { useAppDispatch, useAppSelector } from "@/store";
import { useToast } from "@/common/components/Toast";
import { TranslationCard } from "./TranslationCard";
import Fuse from "fuse.js";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { Card } from "@/common/components/Card";
import { List } from "@/common/components/List";
import { EmptyStateMessage } from "@/common/components/EmptyStateMessage";
import { View, StyleSheet } from "react-native";
import { useThemeBorders } from "@/common/hooks/useThemeBorders";

interface PopulatedTranslation extends Translation {
  userMessage: UserMessage;
}

interface TranslationListProps {
  conversationId?: string;
}

export const TranslationList = ({ conversationId }: TranslationListProps) => {
  const { translationService } = useServices();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { filters } = useAppSelector((state) => state.translation);
  const { search = "", showOnlyFavorites = false } = filters;
  const navigation = useAppNavigation();

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
        userMessage: userMessagesHashmap[t.originalMessageId],
      })),
    [translations, userMessagesHashmap]
  );

  const insertIntoConversation = useCallback(
    (translation: Translation) => {
      if (conversationId) {
        navigation.navigate("Conversation", {
          conversationId,
          initialMessage: translation.text,
        });
      }
    },
    [conversationId, navigation]
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

  const fuseOptions = useMemo(
    () => ({
      keys: [
        "text",
        "title",
        "modality.label",
        "description",
        "notes",
        "edits.text",
        "userMessage.text",
      ],
      threshold: 0.4,
    }),
    []
  );

  const filteredItems = useMemo(() => {
    let filteredItems = populatedTranslations;

    if (showOnlyFavorites) {
      filteredItems = populatedTranslations.filter((t) => t.favorite);
    }
    if (search.trim()) {
      const fuse = new Fuse(filteredItems, fuseOptions);
      return fuse.search(search).map((r: any) => r.item);
    }
    return populatedTranslations;
  }, [populatedTranslations, search, showOnlyFavorites]);

  const darkCardStyles = useThemeBorders();

  return (
    <View style={styles.content}>
      <List<PopulatedTranslation>
        data={filteredItems}
        emptyComponent={<EmptyStateMessage />}
        listStyle={styles.list}
        renderItem={(item) => (
          <Card style={darkCardStyles}>
            <TranslationCard
              translation={item}
              userMessage={userMessagesHashmap[item.originalMessageId]}
              onUpdate={onUpdateTranslation}
              onDelete={onDeleteTranslation}
              onUpdateText={onUpdateTranslationText}
              onInsert={insertIntoConversation}
            />
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  list: {
    padding: 20,
  },
});
