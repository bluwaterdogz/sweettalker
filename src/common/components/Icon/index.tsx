import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface IconProps {
  icon: IconProp;
  size: number;
  color: string;
}

export const Icon = ({ icon, size, color }: IconProps) => {
  return <FontAwesomeIcon icon={icon} size={size} color={color} />;
};
