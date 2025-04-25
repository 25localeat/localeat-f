import React from 'react';
//css 파일 import
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

                        <button className="login-button">로그인</button>
                        <p className="signup-text">
                                아직 회원이 아니신가요? <span className="signUpLink">회원가입</span>
                            </p>
                        </div>
                    </div>
                </div>

        );
    };

export default Login