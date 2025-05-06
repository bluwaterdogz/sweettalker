import React, { useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useTheme } from "@/theme";
import { FlipCard } from "./FlipCard";
import { Card } from "./Card";

interface CardListProps<T> {
  data: T[];
  renderItem: (
    item: T,
    onFlip: () => void,
    isFlipped: boolean
  ) => React.ReactNode;
  renderItemBack?: (item: T, isFlipped: boolean) => React.ReactNode;
  emptyListContent?: React.ReactNode;
}

export const CardList = <T extends { id: string }>({
  data,
  renderItem,
  renderItemBack,
  emptyListContent,
}: CardListProps<T>) => {
  const { colors, typography } = useTheme();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderCard = ({ item }: { item: T }) => {
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
        <Card style={styles.card}>{renderItem(item, () => {}, false)}</Card>
      );
    }
  };

  if (data.length === 0) {
    return (
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
  }

  return (
    <FlatList
      data={data}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 0,
    gap: 8,
  },
  cardContainer: {
    marginBottom: 8,
  },
  card: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
