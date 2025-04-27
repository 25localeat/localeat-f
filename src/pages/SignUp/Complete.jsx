/*
파일명: Complete.css
파일 설명: 로컬잇 회원가입 완료 페이지
작성사: 김미현
기간: 2025-04-27 ~
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './Complete.css'

const guide = `
축하합니다.
회원가입이 완료되었습니다.
로컬잇에서 다양한 서비스를 경험해 보세요
`

const Complete = () => {
    return (
        <div class="container">
            <div className="box">
                <div className="overlay">
                    <p className="title"> {guide}</p>

                    <div className="wrapper">
                        <Link to="/login" style={{textDecoration: "none"}}>
                            <button className="login-button">로그인 하러 가기</button>
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        );
    };

export default Complete;