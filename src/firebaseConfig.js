// firebaseConfig.js
import { initializeApp } from "firebase/app";

// firebase 설정 정보
const firebaseConfig = {
    apiKey: "AIzaSyByP7PpT0SQJOE8Y4js3OgR3zgvlYQv740",
    authDomain: "localeat-e8440.firebaseapp.com",
    projectId: "localeat-e8440",
    storageBucket: "localeat-e8440.firebasestorage.app",
    messagingSenderId: "329514920868",
    appId: "1:329514920868:web:aaaba7e2f6d24bc3c76f31",
    measurementId: "G-ZCQSB79VX1"
  };

// firebase 초기화
const app = initializeApp(firebaseConfig);

export { app };