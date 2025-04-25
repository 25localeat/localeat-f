/* 
파일명 : BuyerOrderHistory.jsx
파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/주문내역 UI
작성자 : 김소망
기간 : 2025-04-25~
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerOrderHistory.css';

const BuyerOrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('currentUser'); // 현재 로그인된 사용자 이름 (buyer 기준)
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const filteredOrders = allOrders.filter(order => order.buyer === user);
        setOrders(filteredOrders);
    }, []);

    const goToReviewForm = (orderId) => {
        navigate(`/mypage/review/write`, { state: { orderId } });//이거 민하님이 만들어주면 수정할거임
    };

    return (
        <div className="mypage-wrapper">
            <div className="page-header">마이페이지</div>

            <div className="mypage-body">
                <div className="sidebar">
                    <ul>
                        <li className="active">주문 내역</li>
                        <li onClick={() => navigate('/mypage/buyer/review')}>리뷰 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/subscribe')}>구독 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/wish')}>찜 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/groupBuy')}>공동구매 현황</li>
                        <li onClick={() => navigate('/mypage/buyer/member-edit')}>회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">주문 내역</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>주문일자</th>
                                <th>주문상태</th>
                                <th>리뷰 등록</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.productName}</td>
                                    <td>{new Date(order.id).toLocaleDateString()}</td>
                                    <td>{order.status}</td>
                                    <td><button className="write-btn" onClick={() => goToReviewForm(order.id)}>등록</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BuyerOrderHistory;
