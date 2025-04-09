/*
파일명  : Navbar.jsx
파일설명 : LocalEat 웹사이트 상단 네비게이션 바 컴포넌트
          - 로고, 검색창, 메뉴 항목, 아이콘 렌더링
          - 전체 페이지에서 고정(top fixed)되어 사용
작성자  : 정여진
작성일  : 2025-04-09.~
*/
import React from 'react';
import './Navbar.css';
import iconLogin from './logo-nav-login.png';
import iconBasket from './logo-nav-basket.png';
import iconAlarm from './logo-nav-alarm.jpg';
import iconLogout from './logo-nav-logout.png';

const Navbar = () => {
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
                    <span>마이페이지</span>
                    <span>구독</span>
                    <span>공동구매</span>
                    <span>찜</span>
                </nav>

                <div className="icons">
                    <img src={iconLogin} alt="login" className="icon-img"/>
                    <img src={iconBasket} alt="basket" className="icon-img"/>
                    <img src={iconAlarm} alt="alarm" className="icon-img"/>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
