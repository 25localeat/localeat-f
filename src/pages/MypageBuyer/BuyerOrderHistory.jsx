/* 
파일명 : BuyerOrderHistory.jsx
파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/주문내역 UI
작성자 : 김소망
기간 : 2025-04-25~
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerOrderHistory.css';
import axios from '../../components/api/axios';

const BuyerOrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [reviewedProductIds, setReviewedProductIds] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser.userId;

        const fetchOrdersAndReviews = async () => {
            try {
                const ordersRes = await axios.get(`/api/orders/user/${userId}`);
                setOrders(ordersRes.data);

                const reviewsRes = await axios.get(`/api/reviews/user/${userId}/products`);
                setReviewedProductIds(reviewsRes.data);
            } catch (error) {
                console.error('불러오기 실패:', error);
            }
        };

        if (userId) fetchOrdersAndReviews();
    }, []);

    const statusMapping = {
        PAID: '결제 완료',
        READY: '배송 준비 중',
        DELIVERING: '배송 중',
        DELIVERED: '배송 완료'
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
                                <th>구매 방법</th>
                                <th>상품이름</th>
                                <th>구매수량</th>
                                <th>개당 가격</th>
                                <th>주문일자</th>
                                <th>주문상태</th>
                                <th>리뷰 등록</th>
                            </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => (
                            order.items.map(item => {
                                const isReviewedProduct = reviewedProductIds.includes(item.productId);

                                return (
                                <tr key={item.id}>
                                    <td>{item.purchaseType}</td>
                                    <td>
                                        <button className="product-link" onClick={() => navigate(`/products/${item.productId}`)}>
                                            {item.productName}
                                        </button>
                                    </td>
                                    <td>{item.quantity}개</td>
                                    <td>{item.price.toLocaleString()}원</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>{statusMapping[item.status] || item.status}</td>
                                    <td>
                                        {isReviewedProduct ? (
                                            <button className="write-btn completed" disabled>작성 완료</button>
                                        ) : (
                                            <button
                                                className={`write-btn ${item.status !== "DELIVERED" ? 'disabled' : ''}`}
                                                onClick={() => navigate(`/review/write/${item.id}`)}
                                                disabled={item.status !== "DELIVERED" || isReviewedProduct}
                                            >
                                                등록
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                );
                            })
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BuyerOrderHistory;
