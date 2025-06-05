import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { EmptyStateMessage } from "@/common/components/EmptyStateMessage";
import { CardList } from "@/common/components";
import { Interpretation } from "../api/models";
import { useThemeBorders } from "../hooks/useThemeBorders";

interface InterpretationListProps<T> {
  renderItem: (item: T) => React.ReactNode;
  items: T[];
}

export function InterpretationList<T extends Interpretation>(
  props: InterpretationListProps<T>
) {
  const { renderItem, items } = props;

  const darkCardStyles = useThemeBorders();

  return (
    <View style={styles.content}>
      <CardList<T>
        data={items}
        emptyListContent={<EmptyStateMessage />}
        cardStyles={darkCardStyles}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  listControls: {
    paddingHorizontal: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
