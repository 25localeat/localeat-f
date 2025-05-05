/*
파일명: SelectType.css
파일 설명: 로컬잇 회원 유형 선택 페이지
작성자: 김미현
기간: 2025-04-27 ~
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './SelectType.css'

const guide = `
로컬잇에 오신 걸 환영합니다.
지금 바로 회원가입을 하고
로컬잇의 다양한 서비스를 경험해 보세요!
`

const SelectType = () => {
    return (
        <div class="st-container">
            <div className="st-box">
                <div className="st-overlay">
                    <p className="st-title">{guide}</p>

                    <div className="member-box-wrapper">
                        <Link to="/signUp/consumer/form" style={{textDecoration: "none"}}>
                            <button className="member-box">개인 회원</button>
                        </Link>
                        <Link to="/signUp/seller/form" style={{textDecoration: "none"}}>
                            <button className="member-box">판매자 회원</button>
                        </Link>
                    </div>
                </div>
            </div>
          </div>


        );
    };

export default SelectType;