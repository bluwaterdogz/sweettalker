import { typography } from "../../theme/typography/typography";
import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { EditableText } from "../EditableText";
import { useTheme } from "../../theme/hooks/useTheme";
interface CardHeaderProps {
  title: string;
  children: ReactNode;
  controls?: ReactNode;
  onEditTitle: (value: string) => void;
}

export const CardHeader = ({
  title,
  children,
  onEditTitle,
  controls,
}: CardHeaderProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: colors.text.secondary,
          backgroundColor: colors.background.primary,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <EditableText
          inputStyle={[
            styles.title,
            typography.titleMedium,
            { color: colors.text.primary, flex: 1 },
          ]}
          onChange={onEditTitle}
          controls={controls}
          value={title}
        />
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    paddingBottom: 16,
    gap: 8,
    borderBottomWidth: 1,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  controls: {
    gap: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    paddingBottom: 2,
  },
});
