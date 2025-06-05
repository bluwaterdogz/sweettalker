import { RootStackParamList } from "./types";
import { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

export function useAppRoute<RouteName extends keyof RootStackParamList>() {
  return useRoute<RouteProp<RootStackParamList, RouteName>>();
}
