import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../../../theme/context";
import { User } from "@/features/firebase-auth/api/models";

interface UserDetailsProps {
  user: User;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const { username, email } = user;
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          typography.titleMedium,
          { color: colors.text.primary },
          styles.name,
        ]}
      >
        {username}
      </Text>
      <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
        {email}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  name: {
    marginBottom: 4,
  },
});
