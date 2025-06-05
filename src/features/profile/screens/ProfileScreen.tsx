import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { ProfileTabs } from "../components/ProfileTabs";
import { ErrorBoundary } from "@/common/components/ErrorBoundary";
import { useUser } from "@/features/auth/hooks/useUser";
import { UserDetails } from "../components/UserDetails";

export const ProfileScreen = () => {
  const { colors } = useTheme();
  const { user } = useUser();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.header}>{user && <UserDetails user={user} />}</View>
      <View style={{ flex: 1 }}>
        <ErrorBoundary>
          <ProfileTabs />
        </ErrorBoundary>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: 16,
    height: 100,
  },
});
