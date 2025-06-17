import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";

import { useAppDispatch } from "@/store";
import { Message as MessageI } from "@common/models/conversation/message";
import { Contact } from "@common/models/contacts/contact";

interface MessageProps {
  message: MessageI;
  isUsersMessage?: boolean;
  showUser?: boolean;
  user: Contact | null;
  onUpdate?: (id: string, data: Partial<MessageI>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const MessageItem: React.FC<MessageProps> = ({
  message,
  isUsersMessage = false,
  showUser = false,
  user,
  onUpdate,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  return (
    <React.Fragment>
      {showUser && (
        <Text
          style={[
            {
              color: colors.text.primary,
            },
            isUsersMessage
              ? {
                  alignSelf: "flex-start",
                }
              : {
                  alignSelf: "flex-end",
                },
          ]}
        >
          {isUsersMessage ? "You" : user?.displayName} said:
        </Text>
      )}
      <View
        style={[
          {
            ...styles.message,
            backgroundColor: colors.background.secondary,
            borderRadius: 16,
          },

          isUsersMessage
            ? {
                ...styles.usersMessage,
                backgroundColor: colors.accent.secondary,
                paddingRight: 16,
                alignSelf: "flex-start",
              }
            : {},
        ]}
      >
        <Text style={[{ color: colors.text.primary }]}>
          {message.displayText}
        </Text>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    padding: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-end",
  },
  usersMessage: {
    alignSelf: "flex-start",
  },
});
