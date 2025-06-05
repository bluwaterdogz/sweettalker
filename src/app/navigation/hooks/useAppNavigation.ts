import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../types";

export const useAppNavigation = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  return navigation;
};
