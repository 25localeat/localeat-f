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
            const formattedNotifications = response.data.map(alarm => ({
                ...alarm,
                timestamp: new Date(alarm.timestamp).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }));
            setNotifications(formattedNotifications);
            console.log('✅ 알림 목록 조회 완료');
        } catch (error) {
            console.error('❌ 알림 조회 중 오류 발생:', error);
            if (error.response) {
                console.error('서버 응답:', error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    // 알림 읽음 처리
    const handleRead = async (alarmId) => {
        try {
            await axios.post(`/alarms/read/${alarmId}`);
            setNotifications(notifications.map(item => 
                item.id === alarmId ? { ...item, isRead: 'Y' } : item
            ));
            console.log('✅ 알림 읽음 처리 완료:', alarmId);
        } catch (error) {
            console.error('❌ 알림 읽음 처리 중 오류 발생:', error);
            if (error.response) {
                console.error('서버 응답:', error.response.data);
            }
        }
    };

    // 알림 삭제
    const handleDelete = async (alarmId, e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        try {
            await axios.delete(`/alarms/${alarmId}`);
            setNotifications(notifications.filter(item => item.id !== alarmId));
            console.log('✅ 알림 삭제 완료:', alarmId);
        } catch (error) {
            console.error('❌ 알림 삭제 중 오류 발생:', error);
            if (error.response) {
                console.error('서버 응답:', error.response.data);
            }
        }
    };

    // 컴포넌트 마운트 시 알림 목록 조회
    useEffect(() => {
        fetchAlarms();
    }, []);

    return (
        <div className="alarm-dropdown">
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
                        <div 
                            className={`alarm-card ${item.isRead === 'Y' ? 'read' : ''}`} 
                            key={item.id}
                            onClick={() => item.isRead !== 'Y' && handleRead(item.id)}
                            style={{ cursor: item.isRead === 'Y' ? 'default' : 'pointer' }}
                        >
                            <div className="alarm-content">
                                {item.isRead !== 'Y' && <div className="dot" />}
                                <div className="alarm-text">
                                    {item.message.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                                <div className="alarm-date">{item.timestamp}</div>
                            </div>
                            <img
                                src={iconClose}
                                alt="삭제"
                                className="alarm-close"
                                onClick={(e) => handleDelete(item.id, e)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlarmDropdown;
