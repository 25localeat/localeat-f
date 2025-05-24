// src/utils/fcm.js
import { messaging } from '../messaging';
import { getToken } from "firebase/messaging";

export async function requestFcmToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: "BIWAfomNjM_O8GuZdjRW7zugZUbWlgO-FG7m8TvTwXlvPh-daHsYuowIBSv2GMNYb-T2uYOSGpRNQn83T_G4ARo"
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);
      localStorage.setItem("fcmToken", currentToken);

      // 예: 백엔드 서버에 토큰 저장 API 호출
      await fetch("/api/save-fcm-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: currentToken }),
      });

      return currentToken;
    } else {
      console.log("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
}
