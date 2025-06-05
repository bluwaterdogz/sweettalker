import { common } from "@/common/styles";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Image,
  StyleSheet,
  TextStyle,
  StyleProp,
  ViewStyle,
  Text,
} from "react-native";

export interface AvatarProps {
  photoURL?: string | null;
  size: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const Avatar = ({
  photoURL,
  size = 24,
  iconColor,
  style,
}: AvatarProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.avatar,
        common.avatar,
        {
          backgroundColor: colors.background.primary,
          width: size * 1.5,
          height: size * 1.5,
          borderRadius: size * 1.5,
        },
        style,
      ]}
    >
      {photoURL != null ? (
        <Image
          source={{ uri: photoURL }}
          style={[
            styles.image,
            common.avatar,
            {
              width: size * 1.5,
              height: size * 1.5,
              borderRadius: size * 1.5,
            },
          ]}
        />
      ) : (
        <FontAwesomeIcon
          color={iconColor || colors.text.primary}
          style={[common.avatar]}
          icon={faUser}
          size={size * 0.6}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {},
});
