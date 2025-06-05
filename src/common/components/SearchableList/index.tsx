import React, { useMemo } from "react";
import { View, StyleSheet, FlatList, StyleProp, ViewStyle } from "react-native";
import { ListControls } from "../ListControls";
import { EmptyStateMessage } from "../EmptyStateMessage";
import Fuse from "fuse.js";
import { Loader } from "../Loader";
import { useControllableState } from "@/common/hooks/useControllableState";

export interface SearchableListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  searchKeys?: (keyof T)[];
  emptyListContent?: React.ReactNode;
  cardStyles?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  showFavorites?: boolean;
  showSearch?: boolean;
  useInternalSearchFilter?: boolean;
  onFavoriteToggle?: (showFavorites: boolean) => void;
  disabled?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
}

export const SearchableList = <T extends { id: string }>({
  data,
  renderItem,
  searchKeys = [],
  emptyListContent,
  loading = false,
  showFavorites = false,
  showSearch = true,
  useInternalSearchFilter = true,
  onFavoriteToggle,
  style,
  disabled = false,
  searchValue,
  setSearchValue,
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
  }, [data, search, fuse]);

  return (
    <View style={[styles.container, style]}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {showSearch && (
            <ListControls
              style={{ padding: 16 }}
              search={search}
              setSearch={setSearch}
              showOnlyFavorites={showFavorites}
              setShowOnlyFavorites={onFavoriteToggle}
              disabled={disabled}
            />
          )}
          {data.length === 0 ? (
            <View style={styles.emptyContainer}>
              {emptyListContent ?? <EmptyStateMessage />}
            </View>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => <>{renderItem(item)}</>}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    // padding: 16,
    gap: 8,
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
