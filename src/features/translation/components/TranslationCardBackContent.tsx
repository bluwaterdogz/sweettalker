import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@/theme";
import { Colors } from "@/theme/colors";
import { Translation } from "../api/models";
import { StarRating } from "@/components/common/StarRating";

interface TranslationCardBackContentProps {
  translation: Translation;
  handleRating: (translation: Translation, rating: number) => void;
  handleFavorite: (translation: Translation, favorite: boolean) => void;
}

export const TranslationCardBackContent: React.FC<
  TranslationCardBackContentProps
> = ({ translation, handleRating, handleFavorite }) => {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.backContent}>
      <View style={styles.content}>
        <Text style={[typography.bodyMedium, styles.text]}>
          {translation.description}
        </Text>
        <StarRating
          value={translation.rating || 0}
          onChange={(val) => handleRating(translation, val)}
        />
        <View style={{ marginTop: 8 }}>
          <Text
            style={{
              color: translation.favorite
                ? colors.primary.main
                : colors.text.secondary,
              fontWeight: "bold",
            }}
            onPress={() => handleFavorite(translation, !translation.favorite)}
          >
            {translation.favorite ? "★ Favorited" : "☆ Add to Favorites"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    backContent: {
      flex: 1,
      backgroundColor: colors.background.paper,
      borderRadius: 12,
    },
    content: {
      flex: 1,
      gap: 8,
      padding: 16,
      justifyContent: "space-between",
    },
    text: {
      marginVertical: 4,
      color: colors.text.primary,
    },
    flipButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.background.paper,
    },
  });
