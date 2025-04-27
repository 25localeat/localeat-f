/*
파일명: Login.jsx
파일 설명: 로컬잇 로그인 화면
작성사: 김미현
기간: 2025-04-10 ~
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'

const Login = () => {
    return (

            <div className="login-container">
                <div className="login-box">
                    <div className="overlay">
                        <p className="login-title">로그인을 하고 로컬잇을 이용해 보세요!</p>

                        <div className="input-box-wrapper">
                          <div className="input-box">
                            <input type="text" placeholder="아이디를 입력하세요" />
                          </div>
                        </div>

                        <div className="input-box-wrapper">
                          <div className="input-box">
                            <input type="password" placeholder="비밀번호를 입력하세요" />
                          </div>
                        </div>

                        <Link to="/">
                            <button className="login-button">로그인</button>
                        </Link>
                        <Link to="/signUp" style={{textDecoration: "none"}}>
                            <p className="signup-text">
                                아직 회원이 아니신가요? <span className="signUpLink">회원가입</span>
                            </p>
                        </Link>
                    </div>
                </div>
            </div>

        );
    };

export default Login