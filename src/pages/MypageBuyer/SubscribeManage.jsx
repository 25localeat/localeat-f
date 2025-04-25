/* 
파일명 : SubscribeManage.jsx
파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/구독관리 UI
작성자 : 김소망
기간 : 2025-04-25~
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscribeManage.css';
import Popup from '../../components/Ui/Popup/Popup';

const deliveryOptions = {
    '1주': 7,
    '2주': 14,
    '1개월': 30
};

const SubscribeManage = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [popupType, setPopupType] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const allSubs = JSON.parse(localStorage.getItem('subscriptions')) || [];
        const filtered = allSubs.filter(sub => sub.buyer === user);
        setSubscriptions(filtered);
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...subscriptions];
        updated[index][field] = value;

        if (field === 'cycle') {
            const baseDate = new Date(updated[index].start);
            const addDays = deliveryOptions[value];
            baseDate.setDate(baseDate.getDate() + addDays);
            updated[index].end = baseDate.toISOString().slice(0, 10);
        }

        setSubscriptions(updated);
    };

    const handleSave = () => {
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        setPopupType('edit');
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
                        <li className="active">구독 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/wish')}>찜 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/groupBuy')}>공동구매 현황</li>
                        <li onClick={() => navigate('/mypage/buyer/member-edit')}>회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">구독 관리</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>구독일자</th>
                                <th>배송주기</th>
                                <th>수량</th>
                                <th>배송기간</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub, index) => (
                                <tr key={index}>
                                    <td>{sub.product}</td>
                                    <td>{sub.start}</td>
                                    <td>
                                        <select value={sub.cycle} onChange={e => handleChange(index, 'cycle', e.target.value)}>
                                            <option value="1주">1주</option>
                                            <option value="2주">2주</option>
                                            <option value="1개월">1개월</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={sub.count} onChange={e => handleChange(index, 'count', e.target.value)}>
                                            {[1, 2, 3, 4].map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>{sub.end}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="save-btn" onClick={handleSave}>완료</button>
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

export default SubscribeManage;
