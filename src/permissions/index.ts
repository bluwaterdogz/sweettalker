import { requestNotificationPermissions } from "./notifications/requestNotificationPermissions";

export async function initializePermissions() {
  await requestNotificationPermissions();
}
