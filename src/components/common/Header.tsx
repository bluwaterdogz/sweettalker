import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/navigation/types";
import { useUser as useFirebaseUser } from "@/features/firebase-auth/hooks/useUser";
import { useUser as useLegacyUser } from "@/features/auth/hooks/useUser";
import { isFeatureEnabled } from "@/config/featureFlags";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/theme/colors";

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuPress }) => {
  const { colors, typography } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const useFirebaseAuth = isFeatureEnabled("USE_FIREBASE_AUTH");
  const firebaseUser = useFirebaseUser();
  const legacyUser = useLegacyUser();
  const user = useFirebaseAuth ? firebaseUser : legacyUser;
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={[styles.safeArea]} edges={["top"]}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <FontAwesomeIcon
            icon={faBars}
            size={20}
            color={colors.primary.main}
          />
        </TouchableOpacity>
        <Text
          style={[typography.headingMedium, { color: colors.text.primary }]}
        >
          {title}
        </Text>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigation.navigate("Profile")}
        >
          <FontAwesomeIcon
            icon={faUser}
            size={20}
            color={colors.primary.main}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background.default,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    menuButton: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarContainer: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
  });
