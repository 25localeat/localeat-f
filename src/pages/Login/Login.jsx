/*
파일명: Login.jsx
파일 설명: 로컬잇 로그인 화면
작성사: 김미현
기간: 2025-04-10 ~
*/

import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'
import Popup from '../../components/Ui/Popup/Popup';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [popupType, setPopupType] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userId.trim() && !password.trim()) {
            setPopupType('id-pwd-error');
            return;
        }

        if (!userId.trim()) {
            setPopupType('id-error');
            return;
        }

        if (!password.trim()) {
            setPopupType('pwd-error');
            return;
        }

        try {
            const response = await axios.post('/login', {
                userId: userId,
                password: password
            });
            
            console.log(response.data);
            localStorage.setItem('user', JSON.stringify(response.data)); //사용자 정보 저장
            navigate('/')
          } catch (error) {
            console.error(error);
            setPopupType('login-error')
          }
    }

    const closePopup = () => {
        setPopupType(null);
    };

    return (

            <div className="login-container">
                <div className="login-box">
                    <div className="overlay">
                        <p className="login-title">로그인을 하고 로컬잇을 이용해 보세요!</p>

                            <input type="text" name="userId" placeholder="아이디를 입력하세요" className="login-input-box"
                             value={userId} onChange={(e) => setUserId(e.target.value)} />

                            <input className="login-input-box" name="password" type="password" placeholder="비밀번호를 입력하세요"
                            value={password} onChange={(e) => setPassword(e.target.value)} />

                            <button className="login-button" onClick={handleLogin}>로그인</button>

                        <Link to="/signUp" style={{textDecoration: "none"}}>
                            <p className="signup-text">
                                아직 회원이 아니신가요? <span className="signUpLink">회원가입</span>
                            </p>
                        </Link>
                    </div>
                </div>

                {popupType && (
                    <Popup
                        type={popupType}
                        onConfirm={closePopup}
                        onCancel={closePopup}
                    />
                )}

            </div>

        );
    };

export default Login;