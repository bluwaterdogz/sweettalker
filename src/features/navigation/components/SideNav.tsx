import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@/theme";
import { useAppDispatch, useAppSelector } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/navigation/types";
import { logout as logoutFirebase } from "@/features/firebase-auth/reducers";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSignOut, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/theme/colors";
import { Button } from "@/components/common";
import { UserDetails } from "@/components/app";
import { userRoutes } from "@/navigation/routes";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const { colors, typography } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();

  const user = useAppSelector((state) => state.firebaseAuth.user);

  const styles = getStyles(colors);

  const handleLogout = async () => {
    await dispatch(logoutFirebase());
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
              {user && <UserDetails user={user} />}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesomeIcon
                  icon={faXmark}
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              {userRoutes.map((route) => (
                <TouchableOpacity
                  key={route.name}
                  style={styles.menuItem}
                  onPress={() => {
                    navigation.navigate(route.name as any);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      typography.bodyLarge,
                      { color: colors.text.primary },
                    ]}
                  >
                    {route.options.title}
                  </Text>
                </TouchableOpacity>
              ))}

              <Button
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogout}
                title="Logout"
                variant="secondary"
                icon={faSignOut}
              ></Button>
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
    closeButton: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    menuItem: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    logoutItem: {
      paddingHorizontal: 20,
      marginTop: "auto",
      marginBottom: 20,
      borderBottomWidth: 0,
    },
  });
