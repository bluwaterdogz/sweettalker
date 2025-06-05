import { Pressable, View, ViewProps, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../theme/hooks/useTheme";
import { useState } from "react";
import { common } from "../../styles";
interface ContentDropdownProps extends ViewProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  topControl?: boolean;
}
export const ContentDropdown = ({
  children,
  icon,
  label = "",
  topControl = false,
  ...rest
}: ContentDropdownProps) => {
  const { colors } = useTheme();
  const [showContent, setShowContent] = useState(false);
  return (
    <View {...rest}>
      {!topControl && showContent && children}
      <Pressable
        onPress={() => setShowContent(!showContent)}
        style={[
          common.row,
          {
            alignSelf: "flex-end",
          },
        ]}
      >
        <Text style={{ color: colors.text.secondary }}>{label}</Text>
        {icon || (
          <FontAwesome
            name={showContent ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.text.secondary}
          />
        )}
      </Pressable>
      {topControl && showContent && children}
    </View>
  );
};
