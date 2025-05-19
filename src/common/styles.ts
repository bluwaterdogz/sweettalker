import { StyleSheet } from "react-native";

export const common = StyleSheet.create({
  shadow: {
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    // Android elevation
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },
  formContainer: {
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  controls: {
    minHeight: 40,
  },
});
