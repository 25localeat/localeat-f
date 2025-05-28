/*
파일명  : Navbar.jsx
파일설명 : LocalEat 웹사이트 상단 네비게이션 바 컴포넌트
          - 로고, 검색창, 메뉴 항목, 아이콘 렌더링
          - 전체 페이지에서 고정(top fixed)되어 사용
작성자  : 김소망
작성일  : 2025-05-22
*/
/*
파일명  : Navbar.jsx
파일설명 : LocalEat 웹사이트 상단 네비게이션 바 컴포넌트
          - 로고, 검색창, 메뉴 항목, 아이콘 렌더링
작성자  : 김소망
작성일  : 2025-05-22
*/

import React, { useEffect, useState } from 'react';
import './Navbar.css';
import iconLogin from './logo-nav-login.png';
import iconAlarm from './logo-nav-alarm.jpg';
import iconLogout from './logo-nav-logout.png';
import { Link, useNavigate } from 'react-router-dom';
import AlarmDropdown from "./Alarm";
import iconSearch from "./icon-search.png";

const NavbarSeller = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [isAlarmOpen, setIsAlarmOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, text: "[주문관리] [상품명] 해당 상품의 주문이 결제되었습니다!" },
        { id: 2, text: "[주문관리] [상품명] 해당 상품의 주문이 결제되었습니다!" },
        { id: 3, text: "[주문관리] [상품명] 해당 상품의 주문이 결제되었습니다!" },
    ]);

    const handleSearchClick = () => {
        if (!keyword.trim()) return;
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    };

    const toggleAlarm = () => {
        setIsAlarmOpen(prev => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("fcmToken");
        setIsLoggedIn(false);
        navigate("/"); // 홈으로 이동
    };

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, []);

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link className="logo" to="/SellerMypage">
                    <span className="logo-green">Local</span>
                    <span className="logo-pink">E</span>
                    <span className="logo-green">at</span>
                    <span className="seller-label">판매자페이지</span>
                </Link>

                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="검색어를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearchClick();
                        }}
                    />
                    <img
                        src={iconSearch}
                        alt="검색아이콘"
                        className="icon-search"
                        onClick={handleSearchClick}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className="icons">
                    {isLoggedIn ? (
                        <img
                            src={iconLogout}
                            alt="logout"
                            className="icon-img"
                            style={{ cursor: 'pointer' }}
                            onClick={handleLogout}
                        />
                    ) : (
                        <Link to="/login">
                            <img src={iconLogin} alt="login" className="icon-img" />
                        </Link>
                    )}

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

export default NavbarSeller;
