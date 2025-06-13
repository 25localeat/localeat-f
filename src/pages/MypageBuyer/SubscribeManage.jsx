/*
 * 파일명 : SubscribeManage.jsx
 * 파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/구독관리 UI (백엔드 연동 버전)
 * 작성자 : 김소망 / 리팩토링: 정여진
 * 기간 : 2025-04-25~
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscribeManage.css';
import Popup from '../../components/Ui/Popup/Popup';
import api from '../../components/api/axios'; // ← axios 인스턴스

const SubscribeManage = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [popupType, setPopupType] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.userId) return;

        api.get(`/api/orders/subscription`, {
            params: { userId: user.userId }
        })
            .then(res => {
                const data = res.data.map(item => ({
                    product: item.productName,
                    productId: item.productId,
                    start: item.startDate,
                    cycle: formatCycle(item.deliveryCycleType, item.deliveryCycleValue),
                    count: item.quantity,
                    end: calculateEndDate(item.startDate, item.deliveryCycleType, item.deliveryCycleValue)
                }));
                setSubscriptions(data);
            })
            .catch(err => {
                console.error('구독 목록 불러오기 실패', err);
            });
    }, []);

    const formatCycle = (type, value) => {
        if (type === 'WEEKLY') return `${value}주`;
        if (type === 'MONTHLY') return `${value}개월`;
        return `${value}${type}`;
    };

    const calculateEndDate = (start, type, value) => {
        const base = new Date(start);
        const addDays = type === 'WEEKLY' ? value * 7 : value * 30;
        base.setDate(base.getDate() + addDays);
        return base.toISOString().slice(0, 10);
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
                                    <td>
                                        <button className="product-link" onClick={() => navigate(`/products/${sub.productId}`)}>
                                            {sub.product}
                                        </button>
                                    </td>
                                    <td>{sub.start}</td>
                                    <td>{sub.cycle}</td>
                                    <td>{sub.count}</td>
                                    <td>{sub.end}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
