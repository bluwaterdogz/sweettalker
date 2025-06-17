import React, { useState } from "react";
import { View, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { FlipCard } from "./FlipCard";
import { Card } from "./Card";
import { List } from "@/common/components/List";

interface CardListProps<T> {
  data: T[];
  renderItem: (
    item: T,
    onFlip: () => void,
    isFlipped: boolean
  ) => React.ReactNode;
  renderItemBack?: (item: T, isFlipped: boolean) => React.ReactNode;
  emptyListContent?: React.ReactNode;
  cardStyles?: StyleProp<ViewStyle>;
}

export const CardList = <T extends { id: string }>({
  data,
  renderItem,
  renderItemBack,
  emptyListContent,
  cardStyles,
}: CardListProps<T>) => {
  const { colors, typography } = useTheme();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderCard = (item: T) => {
    const isFlipped = flippedCards[item.id] || false;
    if (renderItemBack != null) {
      return (
        <View style={styles.cardContainer}>
          <FlipCard
            front={renderItem(item, () => handleFlip(item.id), isFlipped)}
            back={renderItemBack(item, isFlipped)}
            isFlipped={isFlipped}
            onFlip={() => handleFlip(item.id)}
          />
        </View>
      );
    } else {
      return (
        <Card style={[styles.card, cardStyles]}>
          {renderItem(item, () => {}, false)}
        </Card>
      );
    }
  };

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      {emptyListContent ?? (
        <Text
          style={[typography.headingMedium, { color: colors.text.secondary }]}
        >
          None Found
        </Text>
      )}
    </View>
  );

  return (
    <List
      data={data}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      emptyComponent={emptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
