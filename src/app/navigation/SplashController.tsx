import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAppDispatch } from "@/store";
import { setCheckIn } from "@/features/check-in/store/store";
import { useServices } from "@/services/context";
import { Loader } from "@/common/components";
import { useAppNavigation } from "./hooks/useAppNavigation";

export const SplashController = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { checkInService } = useServices();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decideNavigation = async () => {
      try {
        const todaysCheckIn = await checkInService.get(checkInService.getId());
        const newRoute = todaysCheckIn ? "Conversations" : "CheckIn";
        if (todaysCheckIn) {
          dispatch(
            setCheckIn({
              emotions: todaysCheckIn.emotions || [],
              needs: todaysCheckIn.needs || [],
            })
          );
        }
        navigation.reset({
          index: 0,
          routes: [{ name: newRoute }],
        });
      } catch (error) {
        console.error("Error during splash navigation:", error);
        // fallback or error screen logic here if needed
        navigation.reset({
          index: 0,
          routes: [{ name: "CheckIn" }],
        });
      } finally {
        setLoading(false);
      }
    };

    decideNavigation();
  }, []);

  return loading ? <Loader /> : <View />; // fallback empty view just in case
};
