// src/utils/fcm.js
import { messaging } from '../messaging';
import { getToken } from "firebase/messaging";
import axios from 'axios';

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

      // 사용자 정보 가져오기
      const user = JSON.parse(localStorage.getItem('user'));
      console.log("User data:", user);  // 디버깅용 로그 추가
      
      if (!user || !user.userId) {
        console.error("사용자 정보가 없습니다.");
        return null;
      }

      // 백엔드 서버에 토큰과 사용자 정보 저장
      try {
        const requestData = {
          token: currentToken,
          userId: user.userId
        };
        console.log("Sending data to backend:", requestData);  // 디버깅용 로그 추가

        if (!requestData.token || !requestData.userId) {
          console.error("토큰 또는 사용자 ID가 없습니다:", requestData);
          return null;
        }

        const response = await axios.post("/api/fcm/token", requestData);
        
        if (response.status === 200) {
          console.log("FCM 토큰이 성공적으로 저장되었습니다.");
        }
        return currentToken;
      } catch (error) {
        console.error("FCM 토큰 저장 중 오류 발생:", error);
        if (error.response) {
          console.error("서버 응답:", error.response.data);
          console.error("요청 데이터:", error.config.data);  // 디버깅용 로그 추가
        }
        return null;
      }
    } else {
      console.log("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
}

export async function saveExistingToken() {
  try {
    const currentToken = localStorage.getItem('fcmToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!currentToken || !user) {
      console.error("토큰 또는 사용자 정보가 없습니다.");
      return null;
    }

    await axios.post("/api/fcm/token", {
      token: currentToken,  // fcmToken -> token으로 변경
      userId: user.userId
    });
    
    console.log("기존 FCM 토큰이 성공적으로 저장되었습니다.");
    return currentToken;
  } catch (error) {
    console.error("FCM 토큰 저장 중 오류 발생:", error);
    return null;
  }
}

console.log('FCM Token:', localStorage.getItem('fcmToken'));
console.log('User:', localStorage.getItem('user'));
