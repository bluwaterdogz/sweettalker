import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { common } from "@/common/styles";
import { Avatar } from "@/common/components/Avatar";
import { User } from "firebase/auth";

interface UserDetailsProps {
  user: User;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const { displayName, email, photoURL } = user;
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[common.row, styles.nameContainer]}>
        <Avatar size={24} photoURL={photoURL} />
        <Text
          style={[
            typography.titleMedium,
            styles.name,
            { color: colors.text.primary },
          ]}
        >
          {displayName}
        </Text>
      </View>

      <Text style={[typography.bodyMedium, { color: colors.text.primary }]}>
        {email}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  name: {
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
});
