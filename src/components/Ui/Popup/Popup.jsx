/*
파일명 : Popup.jsx
파일설명 : 팝업을 공통 모듈로 뺀 jsx 파일.
작성자 : 정여진
작성일 : 2025-04-24
*/

import React from 'react';
import './Popup.css';
import iconClose from '../icon_x.png';

const Popup = ({ type, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <img
                    src={iconClose}
                    alt="닫기"
                    className="close-icon"
                    onClick={onCancel}
                />

                {type === 'delete' && (
                    <>
                        <p>정말로 삭제하시겠습니까?</p>
                        <div className="btn-group">
                            <button className="confirm" onClick={onConfirm}>예</button>
                            <button className="cancel" onClick={onCancel}>아니오</button>
                        </div>
                    </>
                )}

                {type === 'order' && (
                    <>
                        <p>감사합니다!<br />주문이 완료되었습니다!</p>
                        <div className="btn-group">
                            <button className="confirm" onClick={onConfirm}>홈으로</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Popup;
