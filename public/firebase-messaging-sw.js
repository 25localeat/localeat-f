// firebase-messaging-sw.js

// 1. Firebase SDK 임포트 (CDN 형식)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// 2. Firebase 앱 초기화
firebase.initializeApp({
    apiKey: "AIzaSyByP7PpT0SQJOE8Y4js3OgR3zgvlYQv740",
    authDomain: "localeat-e8440.firebaseapp.com",
    projectId: "localeat-e8440",
    storageBucket: "localeat-e8440.firebasestorage.app",
    messagingSenderId: "329514920868",
    appId: "1:329514920868:web:aaaba7e2f6d24bc3c76f31",
});

// 3. Firebase Messaging 인스턴스 생성
const messaging = firebase.messaging();

// 4. 백그라운드 메시지 수신 핸들링
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신: ', payload);

  const notificationTitle = payload.notification.title || '알림 오류';
  const notificationOptions = {
    body: payload.notification.body || '알림을 수신하지 못했습니다.'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
