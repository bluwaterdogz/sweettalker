import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { ProfileSettings } from "./ProfileSettings";
import { isFeatureEnabled } from "@/config/featureFlags";
import { useUser as useFirebaseUser } from "@/features/firebase-auth/hooks/useUser";
import { useUser as useLegacyUser } from "@/features/auth/hooks/useUser";
import { ProfileTabs } from "./ProfileTabs";

export const Profile = () => {
  const { colors, typography } = useTheme();
  const useFirebaseAuth = isFeatureEnabled("USE_FIREBASE_AUTH");
  const firebaseUser = useFirebaseUser();
  const legacyUser = useLegacyUser();
  const user = useFirebaseAuth ? firebaseUser : legacyUser;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <View style={styles.header}>
        <FontAwesomeIcon icon={faUser} size={60} color={colors.primary.main} />
        <View style={styles.userInfo}>
          <Text
            style={[typography.headingLarge, { color: colors.text.primary }]}
          >
            {user?.username || user?.email}
          </Text>
          <Text
            style={[typography.bodyMedium, { color: colors.text.secondary }]}
          >
            {user?.email}
          </Text>
        </View>
      </View>

      <ProfileTabs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  userInfo: {
    marginLeft: 20,
  },
});
