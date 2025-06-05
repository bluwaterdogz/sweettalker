import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface PageHeaderProps {
  title: string;
  children: React.ReactNode;
}

export const PageHeader = ({ title, children }: PageHeaderProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.header, { color: colors.text.primary }]}>
        {title}
      </Text>
      <View style={styles.headerButtons}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    fontWeight: "bold",
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: "red",
  },
  headerButtons: {
    flexDirection: "row",
    flex: 1,
    gap: 16,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 16,
    height: "100%",
    // marginLeft: "auto",
  },
});
