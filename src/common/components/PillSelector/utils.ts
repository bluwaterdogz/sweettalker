import { ViewStyle } from "react-native";
import { TextStyle } from "react-native";
import { PillConfig } from "./index";

export const objectToPillConfig = (object: {
  key: string;
  label: string;
  value: any;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}): PillConfig<any> => {
  return {
    key: object.key,
    label: object.label,
    value: object.value,
    color: object.color,
    disabled: object.disabled,
    style: object.style,
    labelStyle: object.labelStyle,
  };
};
