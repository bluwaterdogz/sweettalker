import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { userRoutes } from "./routes";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { RootStackNavigationProp } from "./types";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@/shared/components/Header";
import { useNavigationMenu } from "@/shared/components/Navigation/NavigationContext";
import { SideNav } from "@/shared/components/Navigation/SideNav";
import { useSettingsListener } from "@/features/profile/hooks/useSettingsListener";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAppSelector } from "@/store";
import { Fragment } from "react";
import { Image } from "react-native";
import { common } from "@/common/styles";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const { isMenuOpen, closeMenu, toggleMenu } = useNavigationMenu();
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const { photoURL } = user || {};

  const { loading } = useSettingsListener();
  return (
    <Fragment>
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{
          headerShown: true,
          header: ({ options }) => (
            <Header
              title={t(options.title as any)}
              onLeftIconPress={toggleMenu}
              leftIcon={faBars}
              onRightIconPress={() => navigation.navigate("Profile")}
              rightContent={
                photoURL ? (
                  <Image source={{ uri: photoURL }} style={common.avatar} />
                ) : (
                  <FontAwesomeIcon
                    style={common.avatar}
                    icon={faUser}
                    size={24}
                  />
                )
              }
            />
          ),
        }}
      >
        {userRoutes.map((route) => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={route.component}
            options={{
              title: route.tag,
            }}
          />
        ))}
      </Stack.Navigator>
      <SideNav isOpen={isMenuOpen} onClose={closeMenu} />
    </Fragment>
  );
};
