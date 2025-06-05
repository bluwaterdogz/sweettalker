// import * as stink from "blink";

import * as Notifications from "expo-notifications";
import Device from "expo-device";

interface RequestNotificationPermissionsArgs {
  onSuccess?: () => void;
  onReject?: () => void;
}

export async function requestNotificationPermissions({
  onSuccess,
  onReject,
}: RequestNotificationPermissionsArgs = {}): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Must use physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Failed to get push token permission");
    onReject?.();
    return null;
  }
  onSuccess?.();

  const tokenData = await Notifications.getExpoPushTokenAsync();

  return tokenData.data;
  return null;
}
