import React, { useCallback, useMemo } from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { Loader } from "@/common/components/Loader";
import { EmptyStateMessage } from "@/common/components/EmptyStateMessage";
import { ScrollableList } from "./ScrollableList";

export interface ListProps<T> {
  // Data & Rendering
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;

  // Loading & Empty States
  loading?: boolean;
  empty?: boolean;
  emptyComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;

  // Pull to Refresh
  refreshing?: boolean;
  onRefresh?: () => void;

  // Scroll Behavior
  scrollToBottom?: boolean;
  scrollToTop?: boolean;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  fadeSize?: number;
  fadeOpacity?: number;

  // Event Handlers
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  onScrollPositionChange?: (isAtBottom: boolean, isAtTop: boolean) => void;

  // Styling
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  itemSeparatorStyle?: ViewStyle;
  showItemSeparator?: boolean;
  listStyle?: ViewStyle;

  // Custom Components
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ItemSeparatorComponent?: React.ComponentType<any> | null;
}

export function List<T>({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  empty,
  emptyComponent,
  loadingComponent,
  ...scrollableProps
}: ListProps<T>) {
  // Default key extractor
  const defaultKeyExtractor = useCallback((item: T, index: number) => {
    if (typeof item === "object" && item !== null && "id" in item) {
      return String((item as any).id);
    }
    return index.toString();
  }, []);

  const finalKeyExtractor = keyExtractor || defaultKeyExtractor;

  // Default empty state
  const defaultEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <EmptyStateMessage />
      </View>
    ),
    []
  );

  // Default loading component
  const defaultLoadingComponent = useMemo(() => <Loader />, []);

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, scrollableProps.style]}>
        {loadingComponent || defaultLoadingComponent}
      </View>
    );
  }

  // Show empty state
  const shouldShowEmpty = empty ?? data.length === 0;
  if (shouldShowEmpty && !loading) {
    return (
      <View style={[styles.container, scrollableProps.style]}>
        {emptyComponent || defaultEmptyComponent}
      </View>
    );
  }

  return (
    <ScrollableList
      data={data}
      renderItem={renderItem}
      keyExtractor={finalKeyExtractor}
      {...scrollableProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
