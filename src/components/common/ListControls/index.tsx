import { useTheme } from "@/theme";
import { Text, View, StyleSheet } from "react-native";
import { TextInput } from "../TextInput";

interface ListControlsProps {
  setSearch: (search: string) => void;
  setShowOnlyFavorites: (showOnlyFavorites: boolean) => void;
  search: string;
  showOnlyFavorites: boolean;
}

export const ListControls = ({
  setSearch,
  setShowOnlyFavorites,
  search,
  showOnlyFavorites,
}: ListControlsProps) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.controls]}>
      <View style={styles.searchInput}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
        />
      </View>
      <Text
        style={[
          styles.favoriteButton,
          {
            color: showOnlyFavorites
              ? colors.primary.main
              : colors.text.secondary,
          },
        ]}
        onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
      >
        {showOnlyFavorites ? "★ Favorites" : "☆ All"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 8,
  },
  favoriteButton: {
    width: "auto",
    flex: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
