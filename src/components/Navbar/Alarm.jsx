/*
파일명  : Alarm.jsx
파일설명 : 알람을 위한 화면입니다.
작성자  : 정여진
작성일  : 2025-04-24.
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AlarmDropdown.css';
import iconClose from '../Ui/icon_x.png';

const AlarmDropdown = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // 알림 목록 조회
    const fetchAlarms = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.userId) {
                console.error('사용자 정보가 없습니다.');
                return;
            }

            const response = await axios.get(`/alarms/${user.userId}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('알림 조회 중 오류 발생:', error);
        } finally {
            setLoading(false);
        }
    };

    // 알림 삭제 처리
    const handleDelete = async (alarmId) => {
        try {
            await axios.post(`/alarms/read/${alarmId}`);
            setNotifications(notifications.filter(item => item.id !== alarmId));
        } catch (error) {
            console.error('알림 삭제 중 오류 발생:', error);
        }
    };

    // 컴포넌트 마운트 시 알림 목록 조회
    useEffect(() => {
        fetchAlarms();
    }, []);

    return (
        <div className="alarm-dropdown">
            {/* 닫기 버튼 */}
            <div className="dropdown-header">
                <span>알림</span>
                <img src={iconClose} alt="닫기" className="close-btn" onClick={onClose} />
            </div>

            {loading ? (
                <div className="loading">로딩 중...</div>
            ) : notifications.length === 0 ? (
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
                                {item.content.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                            {/* 개별 삭제 버튼 */}
                            <img
                                src={iconClose}
                                alt="삭제"
                                className="alarm-close"
                                onClick={() => handleDelete(item.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlarmDropdown;
