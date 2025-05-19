import { useTheme } from "@/common/theme/hooks/useTheme";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View, Text, StyleSheet } from "react-native";
interface SettingFieldProps {
  icon: IconDefinition;
  title: string;
  children: React.ReactNode;
}
export const SettingField = ({ icon, title, children }: SettingFieldProps) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <FontAwesomeIcon
            icon={icon}
            color={colors.accent.primary}
            size={20}
            style={styles.icon}
          />
          <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>
            {title}
          </Text>
        </View>
        <View style={styles.fieldContainer}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "transparent",
    borderRadius: 8,
    marginTop: 8,
  },
  settingContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  logoutButton: {
    marginTop: 15,
  },
  fieldContainer: {
    display: "flex",
  },
});

export default SettingField;
