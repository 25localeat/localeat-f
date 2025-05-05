/*
파일명: Agreement.css
파일 설명: 로컬잇 회원가입 약관동의 페이지
작성자: 김미현
기간: 2025-04-10 ~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Agreement.css'
import Popup from '../../components/Ui/Popup/Popup';

const agreementText = `
    약관과 관련된
    텍스트 출력란입니다.
    추후 수정 예정
`;

const Agreement = () => {
    const [popupType, setPopupType] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    const closePopup = () => {
        setPopupType(null);
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleAgreeClick = () => {
        if (isChecked) {
            navigate('/signUp/selectType');
        } else {
            setPopupType('agree-Warning'); // 팝업 타입을 커스터마이징 가능
        }
    };

    return (
            <div className="agr-container">
                <div className="agr-box">
                    <div className="agr-overlay">
                        <p className="agr-title">회원가입</p>

                        <div className="agreement-wrapper">
                            <p className="agreement-ment">약관동의</p>
                        </div>

                        <div className="description-content">
                            <p className="description">
                                {agreementText}
                            </p>
                        </div>
                        <div className="checkbox-container">
                            <input type="checkbox" id="terms"checked={isChecked}
                            onChange={handleCheckboxChange}/>
                            <label htmlFor="terms">이용약관에 동의하시겠습니까?</label>
                        </div>
                        <button className="agree-button" onClick={handleAgreeClick}>
                            동의하고 가입하기
                        </button>
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

export default Agreement;