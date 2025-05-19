import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import Fuse from "fuse.js";
import { common } from "@/common/styles";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useThemeSpecificStyles } from "@/common/theme/hooks/useThemeSpecificStyles";
import { EmptyStateMessage } from "@/shared/components";
import { CardList } from "@/common/components";
import { Interpretation } from "../api/models";
import { ListControls } from "@/common/components";
import { useThemeBorders } from "../hooks/useThemeBorders";

interface InterpretationListProps<T> {
  searchKeys: string[];
  renderItem: (item: T) => React.ReactNode;
  items: T[];
}

export function InterpretationList<T extends Interpretation>(
  props: InterpretationListProps<T>
) {
  const { searchKeys = [], renderItem, items } = props;

  const fuseOptions = useMemo(
    () => ({
      keys: searchKeys,
      threshold: 0.4,
    }),
    [searchKeys]
  );

  const [search, setSearch] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const filteredItems = useMemo(() => {
    let filteredItems = items;

    if (showOnlyFavorites) {
      filteredItems = items.filter((t) => t.favorite);
    }
    if (search.trim()) {
      const fuse = new Fuse(filteredItems, fuseOptions);
      return fuse.search(search).map((r: any) => r.item);
    }
    return items;
  }, [items, search, showOnlyFavorites]);

  const darkCardStyles = useThemeBorders();
  const inputThemeStyles = useThemeBorders();

  return (
    <View style={styles.content}>
      <ListControls
        style={styles.listControls}
        searchStyle={inputThemeStyles}
        setSearch={setSearch}
        search={search}
        setShowOnlyFavorites={setShowOnlyFavorites}
        showOnlyFavorites={showOnlyFavorites}
      />
      <CardList<T>
        data={filteredItems}
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
