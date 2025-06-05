import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  StyleProp,
  ViewStyle,
  Text,
} from "react-native";
import { ListControls } from "../ListControls";
import { EmptyStateMessage } from "../EmptyStateMessage";
import Fuse from "fuse.js";
import { useTheme } from "../../theme/hooks/useTheme";
import { getNestedValue } from "../../utils/objectUtils";

export interface GroupedListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  searchKeys?: (keyof T)[];
  emptyListContent?: React.ReactNode;
  cardStyles?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  showFavorites?: boolean;
  onFavoriteToggle?: (showFavorites: boolean) => void;
  disabled?: boolean;
  groupByKey?: string;
  hideSearch?: boolean;
}

export const GroupedList = <T extends { id: string }>({
  data,
  renderItem,
  searchKeys = [],
  emptyListContent,
  cardStyles,
  showFavorites = false,
  onFavoriteToggle,
  style,
  disabled = false,
  groupByKey,
  hideSearch = false,
}: GroupedListProps<T>) => {
  const { colors, typography } = useTheme();
  const [search, setSearch] = React.useState("");

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
    if (!search) return data;
    return fuse.search(search).map((result) => result.item);
  }, [data, search, fuse]);

  // Group the data if groupByKey is provided
  const groupedData = useMemo(() => {
    if (!groupByKey) return [{ title: "", data: filteredData }];

    const groups: { [key: string]: T[] } = {};

    filteredData.forEach((item) => {
      const value = getNestedValue(item, groupByKey, "");
      const firstChar = String(value).charAt(0).toUpperCase();
      const groupKey = /[0-9]/.test(firstChar) ? "#" : firstChar;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => {
        if (a === "#") return -1;
        if (b === "#") return 1;
        return a.localeCompare(b);
      })
      .map(([title, data]) => ({ title, data }));
  }, [filteredData, groupByKey]);

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {emptyListContent ?? <EmptyStateMessage />}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {!hideSearch && (
        <ListControls
          style={{ padding: 16 }}
          search={search}
          setSearch={setSearch}
          showOnlyFavorites={showFavorites}
          setShowOnlyFavorites={onFavoriteToggle}
          disabled={disabled}
        />
      )}
      <SectionList
        sections={groupedData}
        renderItem={({ item }) => <>{renderItem(item)}</>}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={[
              styles.sectionHeader,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <Text
              style={[
                typography.headingSmall,
                { color: colors.text.secondary },
              ]}
            >
              {title}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
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
  sectionHeader: {
    padding: 8,
    paddingHorizontal: 16,
  },
});
