import React, { useMemo, useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, useTheme } from "@/theme";
import { CardList } from "@/components/common/CardList";
import { TranslationCardBackContent } from "./TranslationCardBackContent";
import { TranslationCardContent } from "./TranslationCardContent";
import { Translation, UserMessage } from "@/features/translation/api/models";
import { useServices } from "@/services/provider";
import { Loader } from "@/components/common/Loader";
import { keyBy } from "lodash";
import Fuse from "fuse.js";
import { useToast } from "@/lib/toast";
import { EmptyStateMessage } from "./EmptyStateMessage";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { TextInput } from "@/components/common/TextInput";
import { StarRating } from "@/components/common/StarRating";

const fuseOptions = {
  keys: ["text", "description"],
  threshold: 0.4,
};

export const TranslationList = () => {
  const { colors } = useTheme();
  const { translationService } = useServices();
  const { showToast } = useToast();
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

  const handleRating = useCallback(
    async (translation: Translation, rating: number) => {
      try {
        await translationService.updateTranslation(translation.id, { rating });
        showToast({ type: "success", message: "Rating saved" });
      } catch (error) {
        showToast({ type: "error", message: "Failed to save rating" });
        console.error("Rating error:", error);
      }
    },
    [translationService, showToast]
  );

  const handleFavorite = useCallback(
    async (translation: Translation, favorite: boolean) => {
      try {
        await translationService.updateTranslation(translation.id, {
          favorite,
        });
        showToast({
          type: "success",
          message: favorite ? "Added to favorites" : "Removed favorite",
        });
      } catch (error) {
        showToast({ type: "error", message: "Failed to update favorite" });
        console.error("Favorite error:", error);
      }
    },
    [translationService, showToast]
  );

  const renderBackContent = (translation: Translation, isFlipped: boolean) => (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <StarRating
          value={translation.rating || 0}
          onChange={
            isFlipped ? (val) => handleRating(translation, val) : undefined
          }
          disabled={!isFlipped}
        />
        <Text
          style={{
            color: translation.favorite
              ? colors.primary.main
              : colors.text.secondary,
            fontWeight: "bold",
            marginLeft: 12,
          }}
          onPress={
            isFlipped
              ? () => handleFavorite(translation, !translation.favorite)
              : undefined
          }
        >
          {translation.favorite ? "★ Favorited" : "☆ Add to Favorites"}
        </Text>
      </View>
      <Text style={{ color: colors.text.primary }}>
        {translation.description}
      </Text>
    </View>
  );

  if (loadingTranslations || loadingUserMessages) return <Loader />;

  return (
    <View style={styles.content}>
      <View style={styles.controls}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search translations..."
          style={styles.searchInput}
        />
        <Text
          style={{
            color: showOnlyFavorites
              ? colors.primary.main
              : colors.text.secondary,
            fontWeight: "bold",
          }}
          onPress={() => setShowOnlyFavorites((v) => !v)}
        >
          {showOnlyFavorites ? "★ Favorites" : "☆ All"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        {(translationsError || userMessagesError) && (
          <Text style={{ color: "red" }}>
            {translationsError || userMessagesError}
          </Text>
        )}
        <CardList<Translation>
          data={filteredTranslations}
          renderItem={(translation, onFlip, isFlipped) => (
            <TranslationCardContent
              translation={translation}
              userMessage={userMessagesHashmap[translation.userMessageId]}
            />
          )}
          renderItemBack={(translation, isFlipped) =>
            renderBackContent(translation, isFlipped)
          }
          emptyListContent={<EmptyStateMessage />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, paddingBottom: 16 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});
