import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const fcm = admin.messaging();

export const sendNewMessageNotification = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const message = snap.data();

    if (!message || !message.receiverId) return;

    // Get recipient's FCM token
    const userDoc = await db.collection("users").doc(message.receiverId).get();
    const recipient = userDoc.data();
    const fcmToken = recipient?.fcmToken;

    if (!fcmToken) return;

    // Compose the notification
    const payload: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title: "New message",
        body: message.text || "You have a new message.",
      },
      data: {
        conversationId: message.conversationId,
        senderId: message.senderId,
      },
    };

    try {
      await fcm.send(payload);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });
