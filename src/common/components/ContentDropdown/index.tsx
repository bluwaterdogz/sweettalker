import { Pressable, View, ViewProps } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../theme/hooks/useTheme";
import { useState } from "react";

interface ContentDropdownProps extends ViewProps {
  children: React.ReactNode;
}
export const ContentDropdown = ({
  children,
  ...rest
}: ContentDropdownProps) => {
  const { colors } = useTheme();
  const [showContent, setShowContent] = useState(false);
  return (
    <View {...rest}>
      <Pressable
        onPress={() => setShowContent(!showContent)}
        style={{ alignSelf: "flex-end" }}
      >
        <FontAwesome
          name={showContent ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.text.secondary}
        />
      </Pressable>
      {showContent && children}
    </View>
  );
};
