import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useNavigationMenu } from "@/common/components/Navigation/NavigationContext";

export const MenuButton: React.FC = () => {
  const { colors } = useTheme();
  const { toggleMenu } = useNavigationMenu();

  return (
    <TouchableOpacity style={[styles.button]} onPress={toggleMenu}>
      <FontAwesomeIcon icon={faBars} color={colors.text.secondary} size={25} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    top: -5,
  },
});
