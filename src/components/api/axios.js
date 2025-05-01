/*
파일명 : axios.js
파일설명 : 백엔드와 연결하기 위한 axois 인스턴스 설정 파일
          - baseURL 설정: 환경변수 또는 기본 localhost:8080으로 연결
          - 요청 인터셉터: localStorage에 저장된 JWT 토큰을 Authorization 헤더에 자동 추가
          - 응답 인터셉터: 토큰 만료(403) 시 로그아웃 처리 등 공통 응답 에러 처리
작성자 : 정여진
기간 : 2025-05.01.
*/
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
    const fetchHello = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/hello');
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHello();
    }, []);

    return (
        <div>
            <h1>Hello Page</h1>
        </div>
    );
}

export default App;
