import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TranslationCard } from "./TranslationCard";
import { Translation } from "@/features/translation/api/models";
import { useServices } from "@/services/context";
import { Loader, ListControls, CardList } from "@/components/common";
import { EmptyStateMessage } from "@/components/app";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { UserMessage } from "@/features/common-interpretation/api/models";
import { keyBy } from "lodash";
import Fuse from "fuse.js";

const fuseOptions = {
  keys: ["text", "description"],
  threshold: 0.4,
};

export const TranslationList = () => {
  const { translationService } = useServices();
  const [search, setSearch] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const {
    result: translations,
    loading: loadingTranslations,
    error: translationsError,
  } = useSubscribeFirestore<Translation[]>((...args) =>
    translationService.subscribeToTranslations(...args)
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

  const filteredTranslations = useMemo(() => {
    let items = translations || [];
    if (showOnlyFavorites) {
      items = items.filter((t) => t.favorite);
    }
    if (search.trim()) {
      const fuse = new Fuse(items, fuseOptions);
      return fuse.search(search).map((r: any) => r.item);
    }
    return items;
  }, [translations, search, showOnlyFavorites]);

  if (loadingTranslations || loadingUserMessages) return <Loader />;

  return (
    <View style={styles.content}>
      <ListControls
        setSearch={setSearch}
        search={search}
        setShowOnlyFavorites={setShowOnlyFavorites}
        showOnlyFavorites={showOnlyFavorites}
      />
      {(translationsError || userMessagesError) && (
        <Text style={{ color: "red" }}></Text>
      )}

      <CardList<Translation>
        data={filteredTranslations}
        emptyListContent={<EmptyStateMessage />}
        renderItem={(translation) => (
          <TranslationCard
            translation={translation}
            userMessage={userMessagesHashmap[translation.userMessageId]}
          />
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
    paddingBottom: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
