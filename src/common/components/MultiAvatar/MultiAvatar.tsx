import { User } from "firebase/auth";
import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  Pressable,
} from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { getColorFromHash } from "@/common/theme/utils/colorHash";
import { Contact } from "@common/models/contacts/contact";
import { CountBadge } from "../CountBadge";

interface MultiAvatarProps {
  users: Contact[];
  size?: number;
  avatarStyle?: ViewStyle;
  badgeNumber?: number;
  onUserPress?: (user: Contact) => void;
}

export const MultiAvatar: React.FC<MultiAvatarProps> = ({
  users,
  size = 48,
  avatarStyle,
  badgeNumber,
  onUserPress,
}) => {
  const { colors } = useTheme();
  if (!users || users.length === 0) return null;

  let extraCount = 0;
  // Pick avatars to show
  let avatars: Contact[] = [];

  if (users.length <= 3) {
    avatars = users;
  } else {
    // More than 3: pick 2 random, then show +N
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    avatars = shuffled.slice(0, 3);
    extraCount = users.length - 3;
  }
  // Overlap offsets
  const overlap = size * 0.34;
  return (
    <View style={{ ...styles.container, height: size }}>
      {avatars.map((user, idx) => {
        let viewStyle: ViewStyle = {
          left: idx === 1 ? size * 0.3 : idx * 17,
          zIndex: idx === 1 ? 10 : 5,
          width: idx === 1 ? size : size * 0.7,
          height: idx === 1 ? size : size * 0.7,
          position: "absolute",
          transformOrigin: "center",
        };
        let imageStyle: ImageStyle = {
          width: idx === 1 ? size : size * 0.7,
          height: idx === 1 ? size : size * 0.7,
        };

        if (avatars.length === 1) {
          viewStyle = {
            left: 0,
            zIndex: 10,
            transformOrigin: "center",
          };
          imageStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
          };
        }

        const backgroundColor = user.photoURL
          ? colors.background.primary
          : getColorFromHash(user.id, colors.listItemColors);

        return (
          <Pressable
            key={`${user.id} ${idx}`}
            style={[styles.avatarWrapper, viewStyle]}
            onPress={() => onUserPress?.(user)}
          >
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={{
                  borderRadius: size / 2,
                  borderWidth: size * 0.03,
                  borderColor: colors.background.primary,
                  backgroundColor: colors.background.primary,
                  ...imageStyle,
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  borderRadius: size / 2,
                  borderWidth: size * 0.03,
                  borderColor: colors.background.primary,
                  backgroundColor,
                  ...imageStyle,
                  ...avatarStyle,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size={size * 0.5}
                  color={colors.text.primary}
                />
              </View>
            )}
          </Pressable>
        );
      })}
      {badgeNumber != null && badgeNumber > 0 && (
        <CountBadge count={badgeNumber} top={size * 0.7} left={size * 0.7} />
      )}
      {users.length > 1 && (
        <View
          style={{
            width:
              size + (avatars.length - 1 + (extraCount > 0 ? 1 : 0)) * overlap,
            height: size,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarWrapper: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: "transparent",
  },
});
