// src/components/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 또는 ''로 두고 프록시 설정에 맡겨도 됨
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 (JWT 토큰 자동 추가)
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 응답 인터셉터 (예: 403 → 로그아웃 처리 등)
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            console.warn('로그인이 필요합니다.');
            // localStorage.clear(); // 필요 시 로그아웃 처리
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
