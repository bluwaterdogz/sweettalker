import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { TruncatedText } from "@/common/components/TruncatedText";
import { Avatar } from "@/common/components/Avatar";
import { useThemeBorders } from "@/common/hooks/useThemeBorders";
import { ContactWithConnection } from "../types";

export interface ContactItemProps {
  contact: ContactWithConnection;
  children?: React.ReactNode;
  onPress?: () => void;
  onSecondaryPress?: () => void;
  isActive?: boolean;
  onLongPress?: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  onPress,
  onLongPress,
  children,
  isActive,
}) => {
  const { displayName, email, photoURL } = contact;
  const { colors } = useTheme();
  const avatarStyles = useThemeBorders();
  return (
    <Pressable
      style={[
        styles.row,
        {
          gap: 8,

          backgroundColor: isActive
            ? colors.background.secondary
            : colors.background.primary,
          borderBottomColor: colors.neutral[200],
        },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View
        style={{
          paddingRight: 8,
        }}
      >
        <Avatar size={45} photoURL={photoURL} style={avatarStyles} />
      </View>
      <View style={styles.info}>
        {displayName && (
          <TruncatedText
            text={displayName}
            style={[styles.name, { color: colors.text.primary }]}
          />
        )}
        {email && (
          <TruncatedText
            text={email}
            style={[styles.subtitle, { color: colors.text.secondary }]}
          />
        )}
      </View>
      <View style={styles.actions}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  photoURL: { width: 54, height: 54, borderRadius: 27, marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 15, marginTop: 2 },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  connectButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  connectButtonText: { fontSize: 17, fontWeight: "500" },
  acceptButton: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  acceptButtonText: { fontSize: 17, fontWeight: "500" },
  rejectButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  rejectButtonText: { fontSize: 17, fontWeight: "500" },
  connectedButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  connectedButtonText: { fontSize: 17, fontWeight: "500" },
});
