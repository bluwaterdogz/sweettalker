import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { User } from "@/features/auth/api/models";
import { common } from "@/common/styles";

interface UserDetailsProps {
  user: User;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const { displayName, email, photoURL } = user;
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[common.row, styles.nameContainer]}>
        {photoURL && <Image source={{ uri: photoURL }} style={common.avatar} />}
        <Text
          style={[
            typography.titleMedium,
            { color: colors.text.primary },
            styles.name,
          ]}
        >
          {displayName}
        </Text>
      </View>

      <Text style={[typography.bodyMedium, { color: colors.text.secondary }]}>
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
