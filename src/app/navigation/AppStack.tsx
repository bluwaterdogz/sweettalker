import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DEFAULT_SCREEN, userRoutes } from "./routes";
import {
  faArrowLeft,
  faBars,
  faEnvelope,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { Header } from "@/app/layout/header/Header";
import { useNavigationMenu } from "@/common/components/Navigation/NavigationContext";
import { useSettingsListener } from "@/features/profile/hooks/useSettingsListener";
import { Fragment, useEffect, useMemo } from "react";
import { Avatar } from "@/common/components/Avatar";
import { useUser } from "@/features/auth/hooks/useUser";
import { SideNav } from "@/common/components/Navigation/SideNav";
import { SplashController } from "./SplashController";
import { useUserAuthListener } from "@/features/auth/hooks/userAuthListener";
import { useServices } from "@/services/context";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Icon } from "@/common/components/Icon";
import { Pressable, StyleSheet, View } from "react-native";
import { Conversation } from "@common/models/chat/conversation";
import { CountBadge } from "@/common/components/CountBadge";
import { common } from "@/common/styles";
import { Connection } from "@common/models/contacts/connection";
import { useNotificationListeners } from "@/permissions/notifications/useNotificationListeners";
import { useAppNavigation } from "./hooks/useAppNavigation";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const { isMenuOpen, closeMenu, toggleMenu } = useNavigationMenu();
  const { user } = useUser();
  const { photoURL } = user || {};
  const navigation = useAppNavigation();
  const { conversationService, connectionService } = useServices();

  useUserAuthListener();
  useSettingsListener();
  useNotificationListeners();

  const { result: connections = [] } = useSubscribeFirestore<Connection[]>(
    (d, e) => connectionService.subscribe(d, e)
  );

  const { result: conversations = [] } = useSubscribeFirestore<Conversation[]>(
    (d, e) => conversationService.subscribe(d, e)
  );

  const numPending = useMemo(() => {
    return connections.filter(
      (c) => c.receiverId === user?.uid && c.status === "pending"
    ).length;
  }, [connections, user]);

  const newMessages = useMemo(
    () =>
      conversations.reduce((total, conversation) => {
        return total + (conversation.unreadCounts?.[user?.uid || ""] || 0);
      }, 0),
    [conversations, user]
  );

  return (
    <Fragment>
      <Stack.Navigator
        initialRouteName={DEFAULT_SCREEN}
        screenOptions={{
          headerShown: true,
          freezeOnBlur: true,
          header: ({ options }) => (
            <Header
              onLeftIconPress={toggleMenu}
              leftIcon={faBars}
              leftContent={
                <Fragment>
                  <View style={common.row}>
                    <Pressable
                      style={{ position: "relative" }}
                      onPress={() => {
                        navigation.navigate("Conversations");
                      }}
                    >
                      <Icon icon={faEnvelope} size={24} />
                      {newMessages > 0 && (
                        <View style={common.iconBadge}>
                          <CountBadge count={newMessages} />
                        </View>
                      )}
                    </Pressable>

                    <Pressable
                      onPress={() => navigation.navigate("PendingConnections")}
                    >
                      <Icon icon={faUserClock} size={24} />
                      {numPending > 0 && (
                        <View style={common.iconBadge}>
                          <CountBadge count={numPending} />
                        </View>
                      )}
                    </Pressable>

                    {navigation.canGoBack() && (
                      <Pressable
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <Icon icon={faArrowLeft} size={24} />
                      </Pressable>
                    )}
                  </View>
                </Fragment>
              }
              onRightIconPress={() => navigation.navigate("Profile")}
              rightContent={<Avatar photoURL={photoURL} size={24} />}
            />
          ),
        }}
      >
        <Stack.Screen
          name="SplashController"
          component={SplashController}
          options={{ headerShown: false }}
        />

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

const styles = StyleSheet.create({});
