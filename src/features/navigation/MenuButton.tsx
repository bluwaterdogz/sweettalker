import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/theme";
import { useNavigation } from "./NavigationContext";

export const MenuButton: React.FC = () => {
  const { colors } = useTheme();
  const { toggleMenu } = useNavigation();

  return (
    <TouchableOpacity style={[styles.button]} onPress={toggleMenu}>
      <FontAwesomeIcon icon={faBars} color={colors.primary.light} size={25} />
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
