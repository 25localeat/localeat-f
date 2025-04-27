/*
파일명: Agreement.css
파일 설명: 로컬잇 회원가입 약관동의 페이지
작성사: 김미현
기간: 2025-04-10 ~
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './Agreement.css'

const agreementText = `
    약관과 관련된
    텍스트 출력란입니다.
    추후 수정 예정
`;

const Agreement = () => {
    return (
            <div className="container">
                <div className="box">
                    <div className="overlay">
                        <p className="signUp-title">회원가입</p>

                        <div className="agreement-wrapper">
                            <p className="agreement-ment">약관동의</p>
                        </div>

                        <div className="description-content">
                            <p className="description">
                                {agreementText}
                            </p>
                        </div>
                        <div className="checkbox-container">
                            <input type="checkbox" id="terms" />
                            <label htmlFor="terms">이용약관에 동의하시겠습니까?</label>
                        </div>
                        <Link to="/signUp/selectType">
                            <button className="agree-button">동의하고 가입하기</button>
                        </Link>
                    </div>
                </div>
            </div>

    );
};

export default Agreement