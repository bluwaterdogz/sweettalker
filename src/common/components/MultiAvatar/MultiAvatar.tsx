import { User } from "firebase/auth";
import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
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
}

export const MultiAvatar: React.FC<MultiAvatarProps> = ({
  users,
  size = 48,
  avatarStyle,
  badgeNumber,
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
  const overlap = size * 0.4;
  return (
    <View style={{ ...styles.container, height: size }}>
      {avatars.map((user, idx) => {
        let viewStyle: ViewStyle = {
          left: idx === 1 ? size * 0.3 : idx * 22,
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
            left: size * 0.05,
            zIndex: 10,
            position: "absolute",
            transformOrigin: "center",
          };
          imageStyle = {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: (size * 1.5) / 2,
          };
        }

        const backgroundColor = user.photoURL
          ? colors.background.primary
          : getColorFromHash(user.id, colors.listItemColors);

        return (
          <View
            key={`${user.id} ${idx}`}
            style={[styles.avatarWrapper, viewStyle, avatarStyle]}
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
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size={size * 0.6}
                  color={colors.text.primary}
                />
              </View>
            )}
          </View>
        );
      })}
      {badgeNumber != null && badgeNumber > 0 && (
        <CountBadge count={badgeNumber} />
      )}
      <View
        style={{
          width:
            size + (avatars.length - 1 + (extraCount > 0 ? 1 : 0)) * overlap,
          height: size,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: 90,
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
