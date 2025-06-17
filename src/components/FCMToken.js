// src/components/FCMToken.js
import React, { useEffect, useState } from "react";
import { messaging, getToken } from "../firebase";

function FCMToken() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 브라우저에서 푸시 알림 권한 요청
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // 토큰 가져오기 (v9 SDK 방식)
        getToken(messaging, { vapidKey: 'BIWAfomNjM_O8GuZdjRW7zugZUbWlgO-FG7m8TvTwXlvPh-daHsYuowIBSv2GMNYb-T2uYOSGpRNQn83T_G4ARo' })
          .then((currentToken) => {
            if (currentToken) {
              setToken(currentToken);
              console.log("FCM Token:", currentToken);

              // 여기서 백엔드 API 호출해 토큰 저장하기 (예시)
              fetch("/api/save-fcm-token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: currentToken }),
              }).then(res => {
                if(res.ok) console.log("FCM 토큰 서버에 저장 완료");
              });
            } else {
              console.log("No registration token available. Request permission to generate one.");
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
          });
      } else {
        console.log("Notification permission denied");
      }
    });
  }, []);

  return (
    <div>
      {token ? (
        <p>FCM Token: {token}</p>
      ) : (
        <p>알림 권한을 허용해 주세요.</p>
      )}
    </div>
  );
}

export default FCMToken;
