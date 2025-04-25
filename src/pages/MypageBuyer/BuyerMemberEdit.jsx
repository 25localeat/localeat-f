/* 
파일명 : MemberEdit.jsx
파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/화원정보수정 UI
작성자 : 김소망
기간 : 2025-04-25~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerMemberEdit.css';
import Popup from '../../components/Ui/Popup/Popup';

const BuyerMemberEdit = () => {
    const navigate = useNavigate();
    const [memberInfo, setMemberInfo] = useState({
        id: 'asddf',
        name: '로컬잇',
        businessNumber: '123-45-67890',
        email: 'local@naver.com',
        password: '1234',
        region: ''
    });

    const [editMode, setEditMode] = useState({});
    const [popupType, setPopupType] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMemberInfo({ ...memberInfo, [name]: value });
    };

    const toggleEdit = (field) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = () => {
        setPopupType('edit');
        setEditMode({});
    };

    const closePopup = () => {
        setPopupType(null);
    };

    return (
        <div className="mypage-wrapper">
            <div className="page-header">마이페이지</div>
            <div className="mypage-body">
                <div className="sidebar">
                    <ul>
                        <li onClick={() => navigate('/mypage/buyer/orders')}>주문 내역</li>
                        <li onClick={() => navigate('/mypage/buyer/review')}>리뷰 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/subscribe')}>구독 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/wish')}>찜 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/groupBuy')}>공동구매 현황</li>
                        <li className="active">회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">회원 정보 수정</h2>
                    <table className="edit-table">
                        <tbody>
                            <tr>
                                <td className="label-cell">아이디</td>
                                <td>{memberInfo.id}</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="label-cell">이름</td>
                                <td>
                                    {editMode.name ? (
                                        <input name="name" value={memberInfo.name} onChange={handleChange} />
                                    ) : (
                                        memberInfo.name
                                    )}
                                </td>
                                <td><button className="edit-btn" onClick={() => toggleEdit('name')}>변경</button></td>
                            </tr>
                            <tr>
                                <td className="label-cell">휴대폰번호</td>
                                <td>
                                    {editMode.phoneNumber ? (
                                        <input name="phoneNumber" value={memberInfo.phoneNumber} onChange={handleChange} />
                                    ) : (
                                        memberInfo.phoneNumber
                                    )}
                                </td>
                                <td><button className="edit-btn" onClick={() => toggleEdit('phoneNumber')}>변경</button></td>
                            </tr>
                            <tr>
                                <td className="label-cell">이메일</td>
                                <td>
                                    {editMode.email ? (
                                        <input name="email" value={memberInfo.email} onChange={handleChange} />
                                    ) : (
                                        memberInfo.email
                                    )}
                                </td>
                                <td><button className="edit-btn" onClick={() => toggleEdit('email')}>변경</button></td>
                            </tr>
                            <tr>
                                <td className="label-cell">비밀번호</td>
                                <td>
                                    {editMode.password ? (
                                        <input name="password" value={memberInfo.password} onChange={handleChange} />
                                    ) : (
                                        memberInfo.password
                                    )}
                                </td>
                                <td><button className="edit-btn" onClick={() => toggleEdit('password')}>변경</button></td>
                            </tr>
                            <tr>
                                <td className="label-cell">주소</td>
                                <td>
                                    <select name="region" value={memberInfo.region} onChange={handleChange}>
                                        <option value="">지역 선택</option>
                                        <option>서울/경기/인천</option>
                                        <option>강원</option>
                                        <option>충청</option>
                                        <option>전북</option>
                                        <option>전남/광주</option>
                                        <option>대구/경북</option>
                                        <option>경남/부산/울산</option>
                                        <option>제주</option>
                                    </select>
                                </td>
                                <td><button className="edit-btn" onClick={() => toggleEdit('region')}>변경</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="save-btn" onClick={handleSave}>완료</button>
                    {popupType && (
                        <Popup type={popupType} onConfirm={closePopup} onCancel={closePopup} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerMemberEdit;
