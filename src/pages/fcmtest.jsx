import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// 1. Firebase 초기화 (firebaseConfig에 여러분 설정 넣기)
const firebaseConfig = {
    apiKey: "AIzaSyByP7PpT0SQJOE8Y4js3OgR3zgvlYQv740",
    authDomain: "localeat-e8440.firebaseapp.com",
    projectId: "localeat-e8440",
    storageBucket: "localeat-e8440.firebasestorage.app",
    messagingSenderId: "329514920868",
    appId: "1:329514920868:web:aaaba7e2f6d24bc3c76f31",
    measurementId: "G-ZCQSB79VX1"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export default function FcmTest() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. 사용자에게 알림 권한 요청 및 FCM 토큰 받아오기
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // VAPID 공개키 넣어야 함 (firebase 콘솔 > 클라우드 메시징 > 웹푸시 인증서)
        getToken(messaging, { vapidKey: 'BIWAfomNjM_O8GuZdjRW7zugZUbWlgO-FG7m8TvTwXlvPh-daHsYuowIBSv2GMNYb-T2uYOSGpRNQn83T_G4ARo' })
          .then(currentToken => {
            if (currentToken) {
              setToken(currentToken);
              console.log('FCM 토큰 발급:', currentToken);
            } else {
              setError('토큰을 발급받지 못했습니다.');
            }
          })
          .catch(err => {
            setError('토큰 발급 중 오류: ' + err.message);
          });
      } else {
        setError('알림 권한이 거부되었습니다.');
      }
    });
  }, []);

  return (
    <div>
      <h2>FCM 토큰 발급 테스트</h2>
      {token && <p>토큰: {token}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
