import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@/theme";
import { useAppDispatch } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/navigation/types";
import { isFeatureEnabled } from "@/config/featureFlags";
import { logout as logoutLegacy } from "@/features/auth/reducers";
import { logout as logoutFirebase } from "@/features/firebase-auth/reducers";
import { useUser as useFirebaseUser } from "@/features/firebase-auth/hooks/useUser";
import { useUser as useLegacyUser } from "@/features/auth/hooks/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/theme/colors";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const { colors, typography } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  const useFirebaseAuth = isFeatureEnabled("USE_FIREBASE_AUTH");
  const firebaseUser = useFirebaseUser();
  const legacyUser = useLegacyUser();
  const user = useFirebaseAuth ? firebaseUser : legacyUser;
  const styles = getStyles(colors);

  const handleLogout = async () => {
    if (useFirebaseAuth) {
      await dispatch(logoutFirebase());
    } else {
      await dispatch(logoutLegacy());
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <SafeAreaView
            style={[
              styles.container,
              { backgroundColor: colors.background.default },
            ]}
            edges={["top", "right", "bottom"]}
          >
            <View style={styles.header}>
              <View style={styles.userSection}>
                <View style={styles.avatarContainer}>
                  <FontAwesomeIcon
                    icon={faUser}
                    size={24}
                    color={colors.primary.main}
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text
                    style={[
                      typography.headingSmall,
                      { color: colors.text.primary },
                    ]}
                  >
                    {user?.username || user?.email}
                  </Text>
                  <Text
                    style={[
                      typography.bodySmall,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {user?.email}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesomeIcon
                  icon={faXmark}
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate("Translation");
                  onClose();
                }}
              >
                <Text
                  style={[typography.bodyLarge, { color: colors.text.primary }]}
                >
                  Translation
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate("Profile");
                  onClose();
                }}
              >
                <Text
                  style={[typography.bodyLarge, { color: colors.text.primary }]}
                >
                  Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate("Billing");
                  onClose();
                }}
              >
                <Text
                  style={[typography.bodyLarge, { color: colors.text.primary }]}
                >
                  Billing
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <Text
                  style={[typography.bodyLarge, { color: colors.error.main }]}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
    container: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: "80%",
      elevation: 5,
      shadowColor: colors.neutral[900],
      shadowOffset: {
        width: -2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 1001,
      backgroundColor: colors.background.default,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 30,
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: colors.background.default,
    },
    userSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatarContainer: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    userInfo: {
      marginLeft: 12,
    },
    closeButton: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    menuItem: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    logoutItem: {
      marginTop: "auto",
      marginBottom: 20,
      borderBottomWidth: 0,
    },
  });
