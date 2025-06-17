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
  iconProportion?: number;
}

export const Avatar = ({
  photoURL,
  size = 24,
  iconColor,
  style,
  iconProportion = 0.5,
}: AvatarProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.avatar,
        common.avatar,
        {
          backgroundColor: colors.background.primary,
          width: size,
          height: size,
          borderRadius: size,
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
              width: size,
              height: size,
              borderRadius: size,
            },
          ]}
        />
      ) : (
        <FontAwesomeIcon
          color={iconColor || colors.text.primary}
          style={[common.avatar]}
          icon={faUser}
          size={size * iconProportion}
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
