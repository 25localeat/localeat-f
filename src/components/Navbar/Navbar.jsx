import './Navbar.css';
import iconLogin from './logo-nav-login.png';
import iconLogout from './logo-nav-logout.png';
import iconBasket from './logo-nav-basket.png';
import iconAlarm from './logo-nav-alarm.jpg';
import iconSearch from './icon-search.png';
import AlarmDropdown from "./Alarm";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Popup from '../Ui/Popup/Popup';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [keyword, setKeyword] = useState('');
    const [isAlarmOpen, setIsAlarmOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "[공동구매] 결제 미완료로 자동 취소되었습니다." },
        { id: 2, text: "[공동구매] 모집 완료. 24시간 내 결제해주세요." },
        { id: 3, text: "[배송 예정 안내] 이번 주 배송 예정입니다." },
    ]);

    const toggleAlarm = () => {
        setIsAlarmOpen(prev => !prev);
    };

    // ✅ 로그인 상태 감지: 경로 바뀔 때마다 localStorage 검사
    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, [location.pathname]);

    const handleSearchClick = () => {
        if (!keyword.trim()) return;
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("fcmToken");
        setIsLoggedIn(false);
        navigate("/");
    };

    const handleMypageClick = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setPopupType('loginRequired');
            return;
        }
        navigate('/mypage/buyer/orders');
    };

    const handleSubscribeClick = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setPopupType('loginRequired');
            return;
        }
        navigate('/mypage/buyer/subscribe');
    };

    const handleWishClick = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setPopupType('loginRequired');
            return;
        }
        navigate('/mypage/buyer/wish');
    };

    const closePopup = () => {
        setPopupType(null);
        if (popupType === 'loginRequired') {
            navigate('/login');
        }
    };

    const handleCartClick = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setPopupType('loginRequired');
            return;
        }
        navigate('/cart');
    };

    const handleAlarmClick = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setPopupType('loginRequired');
            return;
        }
        toggleAlarm();
    };

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link className="logo" to="/">
                    <span className="logo-green">Local</span>
                    <span className="logo-pink">E</span>
                    <span className="logo-green">at</span>
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

                <nav className="menu">
                    <span onClick={handleMypageClick} className="menu-item">마이페이지</span>
                    <span onClick={handleSubscribeClick} className="menu-item" style={{ cursor: 'pointer' }}>구독</span>
                    <span
                        className="menu-item"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/search?tag=GROUP_BUY`);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        공동구매
                    </span>
                    <span onClick={handleWishClick} className="menu-item" style={{ cursor: 'pointer' }}>찜</span>
                </nav>

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

                    <span onClick={handleCartClick} style={{ cursor: 'pointer' }}>
                        <img src={iconBasket} alt="basket" className="icon-img" />
                    </span>

                    <div className="alarm-icon-wrapper" style={{ position: 'relative' }}>
                        <img
                            src={iconAlarm}
                            alt="alarm"
                            className="icon-img"
                            onClick={handleAlarmClick}
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

            {popupType && (
                <Popup
                    type={popupType}
                    onConfirm={closePopup}
                    onCancel={() => {
                        setPopupType(null);
                        navigate('/');
                    }}
                />
            )}
        </header>
    );
};

export default Navbar;
