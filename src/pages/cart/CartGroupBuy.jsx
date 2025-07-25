/*
파일명 : CartGroupBuy.jsx
파일설명 : 로컬잇 웹사이트의 장바구니/공동구매 UI
작성자 : 김소망
기간 : 2025-04-11~
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartGeneral.css';
import Popup from '../../components/Ui/Popup/Popup';

const CartGroupBuy = () => {
    const [cartItems, setCartItems] = useState([]);
    const [popupType, setPopupType] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const [expired, setExpired] = useState({});
    const navigate = useNavigate();

    // 로컬스토리지에서 로그인된 사용자 정보 꺼내기
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.userId;

    // 1) 내 장바구니 불러오기
    const fetchCart = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/group-buy-cart`,
                { headers: { 'X-USER-ID': userId } }
            );

            // 각 장바구니 아이템의 상품 정보를 가져오기
            const itemsWithProductInfo = await Promise.all(
                res.data.map(async (item) => {
                    try {
                        // 상품 정보 가져오기
                        const productRes = await axios.get(
                            `http://localhost:8080/api/products/${item.productId}`
                        );
                        const product = productRes.data;

                        return {
                            id: item.cartItemId,
                            groupBuyId: item.groupBuyId,
                            productId: item.productId,
                            name: product.productName,
                            price: Math.floor(product.price * 0.9), // 10% 할인된 가격
                            quantity: item.quantity,
                            paymentStatus: item.paymentStatus,
                            addedAt: new Date(item.addedAt),
                            expiresAt: new Date(item.expiresAt),
                            checked: new Date(item.expiresAt) > new Date()
                        };
                    } catch (err) {
                        console.error('상품 정보 조회 실패:', err);
                        return null;
                    }
                })
            );

            // null이 아닌 아이템만 필터링
            const validItems = itemsWithProductInfo.filter(item => item !== null);
            setCartItems(validItems);
        } catch (err) {
            console.error('장바구니 불러오기 실패', err);
            alert('장바구니 불러오기 실패');
        }
    };

    // 마운트 시 한 번만 호출
    useEffect(() => {
        fetchCart();
    }, []);

    // 2) 남은 시간, 만료 여부 실시간 계산
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const updated = {};
            const expStatus = {};
            cartItems.forEach(item => {
                const diff = Math.max(0, Math.floor((item.expiresAt.getTime() - now) / 1000));
                const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
                const seconds = String(diff % 60).padStart(2, '0');
                updated[item.id] = `${hours}:${minutes}:${seconds}`;
                expStatus[item.id] = diff === 0;
            });
            setTimeLeft(updated);
            setExpired(expStatus);
        }, 1000);
        return () => clearInterval(timer);
    }, [cartItems]);

    // 전체/개별 체크박스
    const toggleAll = e => {
        const checked = e.target.checked;
        setCartItems(cartItems.map(item => ({ ...item, checked })));
    };
    const toggleItem = id => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    // 삭제 팝업
    const confirmDelete = id => {
        setItemToDelete(id);
        setPopupType('delete');
    };
    const deleteItem = async () => {
        try {
            await axios.delete(
                `http://localhost:8080/api/group-buy-cart/${itemToDelete}`,
                { headers: { 'X-USER-ID': userId } }
            );
            await fetchCart();
        } catch (err) {
            console.error('삭제 실패', err);
            alert('삭제에 실패했습니다.');
        } finally {
            setPopupType(null);
            setItemToDelete(null);
        }
    };

    // 주문(결제) 팝업
    const showOrderPopup = () => {
        const selectedIds = cartItems
            .filter(item => item.checked && item.paymentStatus !== 'COMPLETED')
            .map(item => item.id);

        if (selectedIds.length === 0) {
            alert('주문할 상품을 선택해주세요.');
            return;
        }
        setPopupType('order');
    };
    const closePopup = () => { setPopupType(null); setItemToDelete(null); };

    // 선택된 항목 결제 처리
    const handleOrder = async () => {
        try {
            // 주문 생성 API 호출 (POST /api/group-buy-cart/order)
            const selectedIds = cartItems
                .filter(item => item.checked && item.paymentStatus !== 'COMPLETED')
                .map(item => item.id);

            await axios.post(
                'http://localhost:8080/api/group-buy-cart/order',
                selectedIds,
                { headers: { 'X-USER-ID': userId } }
            );

            // 주문내역 페이지로 이동
            navigate('/mypage/buyer/orders');
        } catch (err) {
            alert('주문 처리 중 오류가 발생했습니다.');
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h1>장바구니</h1>
            <div className="flex">
                <button onClick={() => navigate('/cart')}>일반배송</button>
                <button onClick={() => navigate('/cart-subscribe')}>구독</button>
                <button className="active">공동구매</button>
            </div>

            <div className="bg-green-100">
                <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={cartItems.length > 0 && cartItems.every(item => item.checked)}
                />
                <span>전체</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>상품이름</th>
                        <th>가격</th>
                        <th>수량</th>
                        <th>소계</th>
                        <th>남은 시간</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    disabled={expired[item.id] || item.paymentStatus === 'COMPLETED'}
                                    onChange={() => toggleItem(item.id)}
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>
                                <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                                    {item.price / 0.9?.toLocaleString() ?? '0'}원
                                </span>
                                {item.price?.toLocaleString() ?? '0'}원
                            </td>
                            <td>{item.quantity}</td>
                            <td>{(item.price * item.quantity)?.toLocaleString() ?? '0'}원</td>
                            <td style={expired[item.id] ? { color: 'gray' } : {}}>
                                {expired[item.id] ? '만료됨' :
                                    item.paymentStatus === 'COMPLETED' ? '결제완료' :
                                        timeLeft[item.id]}
                            </td>
                            <td>
                                {expired[item.id] && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => confirmDelete(item.id)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="order-btn" onClick={showOrderPopup}>
                주문하기
            </button>

            {popupType && (
                <Popup
                    type={popupType}
                    onCancel={closePopup}
                    onConfirm={async () => {
                        if (popupType === 'delete') await deleteItem();
                        if (popupType === 'order') {
                            await handleOrder();
                            closePopup();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CartGroupBuy;