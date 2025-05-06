import { TranslationList } from "@/features/translation/components/TranslationList";
import { ProfileSettings } from "./ProfileSettings";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export const ProfileTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Settings" component={ProfileSettings} />
      <Tab.Screen name="History" component={TranslationList} />
    </Tab.Navigator>
  );
};
