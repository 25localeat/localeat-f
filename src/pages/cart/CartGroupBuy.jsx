/*
파일명 : CartGroupBuy.jsx
파일설명 : 로컬잇 웹사이트의 장바구니/공동구매 UI
작성자 : 김소망
기간 : 2025-04-11~
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
                `http://localhost:8080/api/cart`,
                { headers: { 'X-USER-ID': userId } }
            );
            // API DTO → UI용 객체로 매핑
            const items = res.data.map(i => ({
                id: i.cartItemId,
                name: i.productName,
                price: i.productPrice ?? i.price,
                quantity: i.quantity,
                addedAt: new Date(i.addedAt),
                expiresAt: new Date(i.expiresAt),
                checked: true
            }));
            setCartItems(items);
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
                `http://localhost:8080/api/cart/${itemToDelete}`,
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
    const showOrderPopup = () => setPopupType('order');
    const closePopup = () => { setPopupType(null); setItemToDelete(null); };

    // 선택된 항목 결제 처리
    const orderSelected = async () => {
        try {
            const selected = cartItems.filter(item => item.checked && !expired[item.id]);
            for (const item of selected) {
                await axios.post(
                    `http://localhost:8080/api/cart/${item.id}/pay`,
                    { paymentStatus: 'COMPLETED' },
                    { headers: { 'X-USER-ID': userId } }
                );
            }
            alert('결제 요청이 완료되었습니다.');
            await fetchCart();
        } catch (err) {
            console.error('결제 요청 실패', err);
            alert('결제 요청에 실패했습니다.');
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
                                    disabled={expired[item.id]}
                                    onChange={() => toggleItem(item.id)}
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.price.toLocaleString()}원</td>
                            <td>{item.quantity}</td>
                            <td>{(item.price * item.quantity).toLocaleString()}원</td>
                            <td style={expired[item.id] ? { color: 'gray' } : {}}>
                                {expired[item.id] ? '만료됨' : timeLeft[item.id]}
                            </td>
                            <td>
                                <button className="delete-btn" onClick={() => confirmDelete(item.id)}>
                                    삭제
                                </button>
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
                            await orderSelected();
                            closePopup();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CartGroupBuy;