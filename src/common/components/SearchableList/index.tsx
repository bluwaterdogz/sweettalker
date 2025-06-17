import React, { useMemo } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { List } from "@/common/components/List";
import { ListControls } from "@/common/components/ListControls";
import { useControllableState } from "@/common/hooks/useControllableState";
import Fuse from "fuse.js";

export interface SearchableListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  searchKeys?: (keyof T)[];
  showSearch?: boolean;
  useInternalSearchFilter?: boolean;
  showFavorites?: boolean;
  onFavoriteToggle?: (showFavorites: boolean) => void;
  disabled?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: ViewStyle;
  loading?: boolean;
  empty?: boolean;
  emptyComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollToBottom?: boolean;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  fadeSize?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  itemSeparatorStyle?: ViewStyle;
  showItemSeparator?: boolean;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ItemSeparatorComponent?: React.ComponentType<any> | null;
}

export const SearchableList = <T extends { id: string }>({
  data,
  renderItem,
  keyExtractor,
  searchKeys = [],
  showSearch = true,
  useInternalSearchFilter = true,
  showFavorites = false,
  onFavoriteToggle,
  disabled = false,
  searchValue,
  setSearchValue,
  style,
  contentContainerStyle,
  loading,
  empty,
  emptyComponent,
  loadingComponent,
  refreshing,
  onRefresh,
  scrollToBottom,
  fadeTop,
  fadeBottom,
  fadeSize,
  onEndReached,
  onEndReachedThreshold,
  itemSeparatorStyle,
  showItemSeparator,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
}: SearchableListProps<T>) => {
  const [search, setSearch] = useControllableState({
    value: searchValue,
    setValue: setSearchValue,
  });

  // Initialize Fuse.js with the data and search keys
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: searchKeys.map((key) => key.toString()),
        threshold: 0.3,
      }),
    [data, searchKeys]
  );

  // Filter and search the data
  const filteredData = useMemo(() => {
    if (!search || !useInternalSearchFilter) return data;
    return fuse.search(search).map((result) => result.item);
  }, [data, search, fuse, useInternalSearchFilter]);

  return (
    <View style={[styles.container, style]}>
      {showSearch && (
        <ListControls
          style={styles.controls}
          search={search}
          setSearch={setSearch}
          showOnlyFavorites={showFavorites}
          setShowOnlyFavorites={onFavoriteToggle}
          disabled={disabled}
        />
      )}
      <List
        data={filteredData}
        renderItem={(item: T) => renderItem(item)}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        loading={loading}
        empty={empty}
        emptyComponent={emptyComponent}
        loadingComponent={loadingComponent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        scrollToBottom={scrollToBottom}
        fadeTop={fadeTop}
        fadeBottom={fadeBottom}
        fadeSize={fadeSize}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        itemSeparatorStyle={itemSeparatorStyle}
        showItemSeparator={showItemSeparator}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    padding: 16,
  },
  list: {
    gap: 8,
  },
});
