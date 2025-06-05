import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/app/navigation/types";
import { logout as logoutFirebase } from "@/features/auth/store/thunks";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSignOut, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/common/components";
import { userRoutes } from "@/app/navigation/routes";
import { UserDetails } from "@/features/profile/components/UserDetails";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const { colors, typography } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  const screenWidth = Dimensions.get("window").width;
  const drawerWidth = screenWidth * 0.8;

  const translateX = useRef(new Animated.Value(drawerWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const handleLogout = async () => {
    await dispatch(logoutFirebase());
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: drawerWidth,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: "rgba(0,0,0,0.5)",
            opacity: overlayOpacity,
          },
        ]}
      >
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateX }],
                backgroundColor: colors.background.primary,
                shadowColor: colors.neutral[900],
                width: drawerWidth,
              },
            ]}
          >
            <View style={[styles.header]}>
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
              {userRoutes
                .filter((route) => !route.excludeFromNav)
                .map((route) => (
                  <TouchableOpacity
                    key={route.name}
                    style={[
                      styles.menuItem,
                      { borderBottomColor: colors.neutral[200] },
                    ]}
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
                      {t(route.tag)}
                    </Text>
                  </TouchableOpacity>
                ))}
              <View style={styles.logoutItem}>
                <Button
                  style={[styles.logoutItem]}
                  onPress={handleLogout}
                  title={t("common.logout")}
                  variant="outline"
                  icon={faSignOut}
                />
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    elevation: 5,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1001,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  logoutItem: {
    paddingHorizontal: 16,
    marginTop: "auto",
    marginBottom: 8,
  },
});
