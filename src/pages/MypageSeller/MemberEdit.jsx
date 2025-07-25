/* 
파일명 : MemberEdit.jsx
파일설명 : 로컬잇 웹사이트의 판매자 마이페이지/회원정보수정 UI
작성자 : 김소망
기간 : 2025-04-25~
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MemberEdit.css';
import Popup from '../../components/Ui/Popup/Popup';
import NavbarSeller from '../../components/Navbar/NavbarSeller';

const MemberEdit = () => {
    const navigate = useNavigate();

    const [memberInfo, setMemberInfo] = useState({
        id: '',
        name: '',
        businessNumber: '',
        email: '',
        password: '',
        region: '',
        address: ''
    });

    const [editMode, setEditMode] = useState({});
    const [popupType, setPopupType] = useState(null);

    // ✅ 초기 판매자 정보 불러오기
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.userId;

        if (!userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        axios.get('/api/seller/profile', { params: { userId } })
            .then(res => {
                const seller = res.data;
                setMemberInfo({
                    id: seller.userId,
                    name: seller.name,
                    businessNumber: seller.businessId,
                    email: seller.email,
                    password: '',
                    region: seller.local || '',
                    address: seller.address || ''
                });
            })
            .catch(err => {
                console.error(err);
                alert('판매자 정보를 불러오지 못했습니다.');
            });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMemberInfo({ ...memberInfo, [name]: value });
    };

    const toggleEdit = (field) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // ✅ 정보 저장
    const handleSave = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.userId;

        try {
            await axios.put(`/api/seller/profile?userId=${userId}`, {
                name: memberInfo.name,
                businessId: memberInfo.businessNumber,
                email: memberInfo.email,
                address: memberInfo.address || '주소 미입력',
                local: memberInfo.region
            });

            setPopupType('edit');
            setEditMode({});
        } catch (error) {
            console.error(error);
            setPopupType('edit-error');
        }
    };

    const closePopup = () => {
        setPopupType(null);
    };

    return (
        <>
            <NavbarSeller />
            <div className="mypage-wrapper">
                <div className="page-header">마이페이지</div>
                <div className="mypage-body">
                    <div className="sidebar">
                        <ul>
                            <li onClick={() => navigate('/SellerMypage')}>상품 목록</li>
                            <li onClick={() => navigate('/mypage/orders')}>주문 관리</li>
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
                                    <td className="label-cell">사업자명</td>
                                    <td>
                                        {editMode.name ? (
                                            <input name="name" value={memberInfo.name} onChange={handleChange} />
                                        ) : memberInfo.name}
                                    </td>
                                    <td><button className="edit-btn" onClick={() => toggleEdit('name')}>변경</button></td>
                                </tr>
                                <tr>
                                    <td className="label-cell">사업자번호</td>
                                    <td>
                                        {editMode.businessNumber ? (
                                            <input name="businessNumber" value={memberInfo.businessNumber} onChange={handleChange} />
                                        ) : memberInfo.businessNumber}
                                    </td>
                                    <td><button className="edit-btn" onClick={() => toggleEdit('businessNumber')}>변경</button></td>
                                </tr>
                                <tr>
                                    <td className="label-cell">이메일</td>
                                    <td>
                                        {editMode.email ? (
                                            <input name="email" value={memberInfo.email} onChange={handleChange} />
                                        ) : memberInfo.email}
                                    </td>
                                    <td><button className="edit-btn" onClick={() => toggleEdit('email')}>변경</button></td>
                                </tr>
                                <tr>
                                    <td className="label-cell">비밀번호</td>
                                    <td>
                                        {editMode.password ? (
                                            <input name="password" value={memberInfo.password} onChange={handleChange} />
                                        ) : '••••••'} {/* 실제로 비밀번호 수정은 별도 처리 권장 */}
                                    </td>
                                    <td><button className="edit-btn" onClick={() => toggleEdit('password')}>변경</button></td>
                                </tr>
                                <tr>
                                    <td className="label-cell">사업장지역</td>
                                    <td>
                                        <select name="region" value={memberInfo.region} onChange={handleChange}>
                                            <option value="">지역 선택</option>
                                            <option value="SGI">서울/경기/인천</option>
                                            <option value="GANGWON">강원</option>
                                            <option value="CHUNGCHEONG">충청</option>
                                            <option value="JEONBUK">전북</option>
                                            <option value="JNGJ">전남/광주</option>
                                            <option value="DGGB">대구/경북</option>
                                            <option value="GNBNUL">경남/부산/울산</option>
                                            <option value="JEJU">제주</option>
                                        </select>
                                    </td>
                                    <td><button className="edit-btn" onClick={() => toggleEdit('region')}>변경</button></td>
                                </tr>
                                <tr>
                                    <td className="label-cell">주소</td>
                                    <td>
                                        {editMode.address ? (
                                            <input name="address" value={memberInfo.address} onChange={handleChange} />
                                        ) : memberInfo.address}
                                    </td>
                                    <td><button className="edit-btn" onClick={() => toggleEdit('address')}>변경</button></td>
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
        </>
    );
};

export default MemberEdit;
