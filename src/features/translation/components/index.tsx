import React, { useCallback, useState, useMemo } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { useToast } from "@/lib/toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, useAppSelector } from "@/store";
import { setInputText, clearInputText } from "../slice";
import { translateText } from "../thunks";
import { TranslationControls } from "./TranslationControls";
import { Translation } from "../api/models";
import { useTheme } from "@/theme";
import { useServices } from "@/services/provider";
import { mockUserMessages } from "../mocks";
import { StarRating } from "@/components/common/StarRating";
import Fuse from "fuse.js";
import { TranslationList } from "./TranslationList";
import { useUser } from "@/features/firebase-auth/hooks/useUser";
import { Colors } from "@/theme/colors";
const fuseOptions = {
  keys: ["text", "description"],
  threshold: 0.4,
};

export const Translate: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { inputText, translations, pastTranslations, status, error } =
    useSelector((state: RootState) => state.translation);
  const { translationService } = useServices();

  const { typography, colors } = useTheme();

  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const mockUserMessage = useCallback(() => {
    if (mockUserMessages.length === 0) return;
    const idx = Math.floor(Math.random() * mockUserMessages.length);
    dispatch(setInputText(mockUserMessages[idx]));
  }, []);

  const clearUserMessage = useCallback(() => {
    dispatch(clearInputText());
  }, [dispatch]);

  const handleTranslate = useCallback(() => {
    dispatch(translateText(inputText))
      .unwrap()
      .catch((error: string) => {
        showToast({
          type: "error",
          message: error,
        });
      });
  }, [inputText]);

  // Combine and filter translations
  const allTranslations = useMemo(
    () => [...translations, ...pastTranslations],
    [translations, pastTranslations]
  );
  const filteredTranslations = useMemo(() => {
    let items = allTranslations;
    if (showOnlyFavorites) {
      items = items.filter((t) => t.favorite);
    }
    if (search.trim()) {
      const fuse = new Fuse(items, fuseOptions);
      return fuse.search(search).map((r) => r.item);
    }
    return items;
  }, [allTranslations, search, showOnlyFavorites]);

  const handleRating = async (translation: Translation, rating: number) => {
    await translationService.updateTranslation(translation.id, { rating });
    showToast({ type: "success", message: "Rating saved!" });
  };

  const handleFavorite = async (
    translation: Translation,
    favorite: boolean
  ) => {
    await translationService.updateTranslation(translation.id, { favorite });
    showToast({
      type: "success",
      message: favorite ? "Added to favorites!" : "Removed from favorites.",
    });
  };

  const renderBackContent = (item: Translation) => (
    <View style={styles.backContent}>
      <View style={styles.content}>
        <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>
          {item.description}
        </Text>
        <StarRating
          value={item.rating || 0}
          onChange={(val) => handleRating(item, val)}
        />
        <View style={{ marginTop: 8 }}>
          <Text
            style={{
              color: item.favorite
                ? colors.primary.main
                : colors.text.secondary,
              fontWeight: "bold",
            }}
            onPress={() => handleFavorite(item, !item.favorite)}
          >
            {item.favorite ? "★ Favorited" : "☆ Add to Favorites"}
          </Text>
        </View>
      </View>
    </View>
  );

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <TranslationControls
        handleTranslate={handleTranslate}
        mockUserMessage={mockUserMessage}
        clearUserMessage={clearUserMessage}
      />
      {status === "loading" && <Text>Loading...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <TranslationList />
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background.default,
    },
    backContent: {
      flex: 1,
      backgroundColor: colors.background.paper,
      borderRadius: 12,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
      backgroundColor: colors.background.default,
    },
    content: {
      flex: 1,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
    },
  });
