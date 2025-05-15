import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { useUser } from "@/features/firebase-auth/hooks/useUser";
import { ProfileTabs } from "./ProfileTabs";
import { UserDetails } from "@/components/app";

export const ProfileScreen = () => {
  const { colors } = useTheme();
  const user = useUser();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <View style={styles.header}>{user && <UserDetails user={user} />}</View>
      <View style={{ flex: 1 }}>
        <ProfileTabs />
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
