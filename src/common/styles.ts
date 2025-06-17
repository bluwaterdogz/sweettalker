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
    shadowRadius: 5,

    // Android elevation
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    gap: 16,
  },
  iconBadge: {
    position: "absolute",
    top: -20,
    left: -25,
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },

  scrollRow: {
    flexDirection: "row",
    overflow: "scroll",
    gap: 4,
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
    minHeight: 38,
  },
});

export const styleConsts = {
  rowMarginBottom: 10,
};
