import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ViewStyle } from "react-native";

interface IconProps {
  style?: ViewStyle;
  icon: IconProp;
  size: number;
  color?: string;
}

export const Icon = ({ icon, size, color = "black", style }: IconProps) => {
  return (
    <FontAwesomeIcon icon={icon} size={size} color={color} style={style} />
  );
};
