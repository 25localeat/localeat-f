import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Popup from '../../components/Ui/Popup/Popup';
import { requestFcmToken } from '../../utils/fcm';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [userRole, setUserRole] = useState('CONSUMER'); // ✅ 기본값 설정 
    const [popupType, setPopupType] = useState(null);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!userId.trim() && !password.trim()) {
            setPopupType('id-pwd-error');
            return;
        }
        if (!userId.trim()) {
            setPopupType('id-error');
            return;
        }
        if (!password.trim()) {
            setPopupType('pwd-error');
            return;
        }

        try {
            const response = await axios.post('/login', {
                userId: userId,
                password: password,
                userRole: userRole
            });

            console.log(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            console.log(localStorage.getItem("user"));

            // 로그인할 때마다 FCM 토큰 새로 요청
            localStorage.removeItem("fcmToken"); // 기존 토큰 삭제
            await requestFcmToken(); // 새 토큰 요청

            console.log(localStorage.getItem("fcmToken"));

            // ✅ 역할에 따라 페이지 이동 다르게 설정
            if (userRole === 'SELLER') {
                navigate('/SellerMypage'); // 판매자 홈
            } else {
                navigate('/'); // 소비자 홈
            }
        } catch (error) {
            console.error(error);
            setPopupType('login-error');
        }
    };

    const closePopup = () => {
        setPopupType(null);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="overlay">
                    <p className="login-title">로그인을 하고 로컬잇을 이용해 보세요!</p>

                    <input type="text" placeholder="아이디를 입력하세요" className="login-input-box"
                        value={userId} onChange={(e) => setUserId(e.target.value)} />

                    <input className="login-input-box" type="password" placeholder="비밀번호를 입력하세요"
                        value={password} onChange={(e) => setPassword(e.target.value)} />

                    {/* ✅ 사용자 역할 선택 라디오 버튼 */}
                    <div className="role-selector">
                        <label>
                            <input type="radio" value="CONSUMER" checked={userRole === 'CONSUMER'}
                                onChange={() => setUserRole('CONSUMER')} />
                            소비자
                        </label>
                        <label>
                            <input type="radio" value="SELLER" checked={userRole === 'SELLER'}
                                onChange={() => setUserRole('SELLER')} />
                            판매자
                        </label>
                    </div>

                    <button className="login-button" onClick={handleLogin}>로그인</button>

                    <Link to="/signUp" style={{ textDecoration: "none" }}>
                        <p className="signup-text">
                            아직 회원이 아니신가요? <span className="signUpLink">회원가입</span>
                        </p>
                    </Link>
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

export default Login;
