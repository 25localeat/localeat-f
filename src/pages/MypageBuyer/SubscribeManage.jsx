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
    const [editableSubscriptions, setEditableSubscriptions] = useState([]);

    const mapCycleType = (type, value) => {
        if (type === 'WEEKLY') return `WEEKLY_${value}`;
        if (type === 'MONTHLY') return `MONTHLY_${value}`;
        return type; // fallback
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.userId) return;
        console.log('[✅ PUT 성공] 값 반영 완료, fetch 시작');

        api.get(`/api/orders/subscription`, {
            params: { userId: user.userId }
        })
            .then(res => {
                console.log('[📦 GET 응답]', res.data);
                const data = res.data.map(item => {
                    const fullType = `${item.deliveryCycleType}_${item.deliveryCycleValue}`;
                    return {
                        id: item.id,
                        product: item.productName,
                        start: item.startDate,
                        cycleType: item.deliveryCycleType,
                        cycleValue: item.deliveryCycleValue,
                        fullCycle: fullType,
                        count: item.quantity,
                        end: calculateEndDate(item.startDate, item.deliveryCycleType, item.deliveryCycleValue),
                    };
                });

                const copied = data.map(item => ({ ...item }));
                setSubscriptions(copied);
                setEditableSubscriptions(copied);
            })
            .catch(err => {
                console.error('구독 목록 불러오기 실패', err);
            });
    }, []);

    const calculateEndDate = (start, type, value) => {
        const base = new Date(start);
        const isWeekly = type.startsWith('WEEKLY');
        const addDays = Number(value) * (isWeekly ? 7 : 30);
        base.setDate(base.getDate() + addDays);
        return base.toISOString().slice(0, 10);
    };

    const handleChange = (index, field, value) => {
        setEditableSubscriptions(prev =>
            prev.map((sub, i) =>
                i === index ? { ...sub, [field]: value } : sub
            )
        );
    };

    const handleApply = (sub) => {
        api.put(`/api/subscribe-order/subscription/${sub.id}`, {
            deliveryCycleType: sub.cycleType,
            deliveryCycleValue: parseInt(sub.cycleValue),
            quantity: parseInt(sub.count),
        })
            .then(() => {
                alert('변경 완료');

                // 여기에 다시 fetch 로직 추가!
                api.get(`/api/orders/subscription`, {
                    params: { userId: JSON.parse(localStorage.getItem('user')).userId }
                }).then(res => {
                    const refreshed = res.data.map(item => {
                        const fullType = `${item.deliveryCycleType}_${item.deliveryCycleValue}`; // 예: "WEEKLY_2"
                        return {
                            id: item.id,
                            product: item.productName,
                            start: item.startDate,
                            cycleType: item.deliveryCycleType,
                            cycleValue: item.deliveryCycleValue,
                            fullCycle: fullType, // ← 여기서 select에 직접 쓸 값
                            count: item.quantity,
                            end: calculateEndDate(item.startDate, item.deliveryCycleType, item.deliveryCycleValue),
                        };
                    });
                    console.log(' GET 후 받은 데이터]', res.data);

                    const copied = refreshed.map(r => ({ ...r }));
                    setSubscriptions(copied);
                    setEditableSubscriptions(copied);
                });

            })
            .catch(err => {
                console.error('구독 정보 수정 실패', err);
                alert('수정 실패');
            });
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
                            <th>수정</th>
                        </tr>
                        </thead>
                        <tbody>
                        {editableSubscriptions.map((sub, index) => (
                            <tr key={`${sub.id}-${sub.count}-${sub.fullCycle}`}>
                                <td>{sub.product}</td>
                                <td>{sub.start}</td>
                                <td>
                                    <select
                                        value={sub.fullCycle}
                                        onChange={e => {
                                            const [type, value] = e.target.value.split('_');
                                            handleChange(index, 'cycleType', type);
                                            handleChange(index, 'cycleValue', value);
                                            handleChange(index, 'fullCycle', e.target.value);
                                        }}
                                    >
                                        <option value="WEEKLY_1">1주</option>
                                        <option value="WEEKLY_2">2주</option>
                                        <option value="MONTHLY_1">1개월</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={sub.count}
                                        onChange={e => handleChange(index, 'count', e.target.value)}
                                    />
                                </td>
                                <td>{calculateEndDate(sub.start, sub.cycleType, sub.cycleValue)}</td>
                                <td>
                                    <button onClick={() => handleApply(sub)}>적용</button>
                                </td>
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
