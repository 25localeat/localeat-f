/*
파일명  : Navbar.jsx
파일설명 : LocalEat 웹사이트 상단 네비게이션 바 컴포넌트
          - 로고, 검색창, 메뉴 항목, 아이콘 렌더링
          - 전체 페이지에서 고정(top fixed)되어 사용
작성자  : 정여진
작성일  : 2025-04-09.~
*/
import React, { useState } from 'react';
import './Navbar.css';
import iconLogin from './logo-nav-login.png';
import iconBasket from './logo-nav-basket.png';
import iconAlarm from './logo-nav-alarm.jpg';
import iconLogout from './logo-nav-logout.png';
import { Link } from 'react-router-dom'; // 소망쓰가 추가했어요
import AlarmDropdown from "./Alarm";

const Navbar = () => {

    const [isAlarmOpen, setIsAlarmOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, text: "[공동구매] [상품명] 결제하신 공동구매는 참여 인원의 결제 미완료로 자동 취소되었습니다. 결제하신 금액은 3~5일 내 입력하신 계좌로 환불될 예정입니다. 같은 상품으로 공동구매를 다시 시작해보세요!" },
        { id: 2, text: "[공동구매] [상품명] 공동구매 인원 모집이 완료되었습니다. 24시간 내에 구매완료하셔야 공동구매가 최종 성사됩니다." },
        { id: 3, text: "[배송 예정 안내] [상품명]이 곧 배송될 예정입니다. 정기구독 일정에 따라 이번 주 [요일]에 발송됩니다." },
    ]);

    const toggleAlarm = () => {
        setIsAlarmOpen(prev => !prev);
    };

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <div className="logo">
                    <span className="logo-green">Local</span>
                    <span className="logo-pink">E</span>
                    <span className="logo-green">at</span>
                </div>

                <div className="search-bar">
                    <div className="search-input"></div>
                    <div className="search-icon-circle"></div>
                    <div className="search-icon-line"></div>
                </div>

                <nav className="menu">
                    <Link to="/mypage/buyer/orders" className="menu-item">마이페이지</Link>
                    <Link to="/mypage/buyer/subscribe" className="menu-item">구독</Link>
                    <span>공동구매</span>
                    <Link to="/mypage/buyer/wish" className="menu-item">찜</Link>
                </nav>

                <div className="icons">
                    <Link to="/login">
                        <img src={iconLogin} alt="login" className="icon-img" />
                    </Link>
                    <Link to="/cart">
                        <img src={iconBasket} alt="basket" className="icon-img" />
                    </Link>
                    <div className="alarm-icon-wrapper" style={{ position: 'relative' }}>
                        <img
                            src={iconAlarm}
                            alt="alarm"
                            className="icon-img"
                            onClick={toggleAlarm}
                            style={{ cursor: 'pointer' }}
                        />
                        {isAlarmOpen && (
                            <AlarmDropdown
                                notifications={notifications}
                                onDelete={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
                                onClose={() => setIsAlarmOpen(false)}
                            />
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Navbar;
