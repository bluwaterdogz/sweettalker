import { useTheme } from "../../theme/hooks/useTheme";
import { Text, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { TextInput } from "../TextInput";
import { useTranslation } from "react-i18next";

interface ListControlsProps {
  setSearch: (search: string) => void;
  setShowOnlyFavorites: (showOnlyFavorites: boolean) => void;
  search: string;
  showOnlyFavorites: boolean;
  disabled?: boolean;
  searchStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export const ListControls = ({
  setSearch,
  setShowOnlyFavorites,
  search,
  showOnlyFavorites,
  disabled = false,
  style,
  searchStyle,
}: ListControlsProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={[styles.controls, style]}>
      <View style={styles.searchInput}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t("common.search")}
          disabled={disabled}
          style={searchStyle}
        />
      </View>
      <Text
        style={[
          styles.favoriteButton,
          {
            color: showOnlyFavorites
              ? colors.accent.primary
              : colors.text.secondary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={() => !disabled && setShowOnlyFavorites(!showOnlyFavorites)}
      >
        {showOnlyFavorites
          ? `★ ${t("common.favorites")}`
          : `☆ ${t("common.all")}`}
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
