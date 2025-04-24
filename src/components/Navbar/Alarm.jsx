/*
파일명  : Alarm.jsx
파일설명 : 알람을 위한 화면입니다.
작성자  : 정여진
작성일  : 2025-04-24.
*/

import React from 'react';
import './AlarmDropdown.css';
import iconClose from '../Ui/icon_x.png';

const AlarmDropdown = ({ notifications, onDelete, onClose }) => {
    return (
        <div className="alarm-dropdown">
            {/* 닫기 버튼 */}
            <div className="dropdown-header">
                <span>알림</span>
                <img src={iconClose} alt="닫기" className="close-btn" onClick={onClose} />
            </div>

            {notifications.length === 0 ? (
                <div className="no-alarm">알람이 없습니다.</div>
            ) : (
                <div className="alarm-list">
                    {notifications.map((item) => (
                        <div className="alarm-card" key={item.id}>
                            <div className="icon">
                                <div className="dot" />
                                <div className="bar1" />
                                <div className="bar2" />
                            </div>
                            <div className="alarm-text">
                                {item.text.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                            {/* 개별 삭제 버튼 */}
                            <img
                                src={iconClose}
                                alt="삭제"
                                className="alarm-close"
                                onClick={() => onDelete(item.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default AlarmDropdown;
