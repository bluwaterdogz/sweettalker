import { typography } from "@/theme/typography";
import { colors } from "@/theme";
import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { EditableText } from "../EditableText";

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
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <EditableText
          inputStyle={[
            typography.titleMedium,
            { color: colors.text.secondary, flex: 1 },
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
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    backgroundColor: colors.background.paper,
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
});
