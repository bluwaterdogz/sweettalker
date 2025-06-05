import { useEffect } from "react";
// import * as Notifications from "expo-notifications";

export function useNotificationListeners() {
  useEffect(() => {
    // const receivedListener = Notifications.addNotificationReceivedListener(
    //   (notification) => {
    //     console.log("Notification received in foreground:", notification);
    //   }
    // );
    // const responseListener =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log("User interacted with notification:", response);
    //   });
    // return () => {
    //   receivedListener.remove();
    //   responseListener.remove();
    // };
  }, []);
}
