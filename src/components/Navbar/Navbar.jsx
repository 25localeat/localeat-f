import './Navbar.css';
import iconLogin from './logo-nav-login.png';
import iconLogout from './logo-nav-logout.png';
import iconBasket from './logo-nav-basket.png';
import iconAlarm from './logo-nav-alarm.jpg';
import iconSearch from './icon-search.png';
import AlarmDropdown from "./Alarm";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [keyword, setKeyword] = useState('');
    const [isAlarmOpen, setIsAlarmOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
                    <Link to="/mypage/buyer/orders" className="menu-item">마이페이지</Link>
                    <Link to="/mypage/buyer/subscribe" className="menu-item">구독</Link>
                    <span
                        className="menu-item"
                        onClick={() => navigate(`/search?tag=GROUP_BUY`)}
                        style={{ cursor: 'pointer' }}
                    >
                        공동구매
                    </span>
                    <Link to="/mypage/buyer/wish" className="menu-item">찜</Link>
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
