/*
파일명 : CartGroupBuy.jsx
파일설명 : 로컬잇 웹사이트의 장바구니/공동구매 UI
작성자 : 김소망
기간 : 2025-04-11~
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartGeneral.css';
import Popup from '../../components/Ui/Popup/Popup';

const now = new Date();//이건 그냥 에시입니다 현재 시점이 담긴 시간
const initialGroupBuyItems = [
    // 2시간 전 담김
    { id: 1, name: '약과', price: 2000, quantity: 4, checked: true, addedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), },
    //25시간 전이므로 만료된겨겨
    { id: 2, name: '약과', price: 5000, quantity: 1, checked: true, addedAt: new Date(now.getTime() - 25 * 60 * 60 * 1000), },
    //10분전 담긴거
    { id: 3, name: '약과', price: 5000, quantity: 5, checked: true, addedAt: new Date(now.getTime() - 10 * 60 * 1000), },
];

const CartGroupBuy = () => {
    const [cartItems, setCartItems] = useState(initialGroupBuyItems);
    const [popupType, setPopupType] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const [expired, setExpired] = useState({});
    const navigate = useNavigate();

    // 타이머 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const updated = {};
            const expiredStatus = {};

            cartItems.forEach(item => {
                const expiresAt = new Date(item.addedAt.getTime() + 24 * 60 * 60 * 1000);
                const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
                const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
                const seconds = String(diff % 60).padStart(2, '0');
                updated[item.id] = `${hours}:${minutes}:${seconds}`;
                expiredStatus[item.id] = diff === 0;
            });

            setTimeLeft(updated);
            setExpired(expiredStatus);
        }, 1000);

        return () => clearInterval(timer);
    }, [cartItems]);

    const toggleAll = (e) => {
        const checked = e.target.checked;
        setCartItems(cartItems.map(item => ({ ...item, checked })));
    };

    const toggleItem = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setPopupType('delete');
    };

    const deleteItem = () => {
        setCartItems(cartItems.filter(item => item.id !== itemToDelete));
        setPopupType(null);
        setItemToDelete(null);
    };

    const showOrderPopup = () => {
        setPopupType('order');
    };

    const closePopup = () => {
        setPopupType(null);
        setItemToDelete(null);
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
                <input type="checkbox" onChange={toggleAll} checked={cartItems.every(item => item.checked)} />
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
                            <td><input
                                type="checkbox"
                                checked={item.checked}
                                disabled={expired[item.id]} // 만료되면 체크 불가
                                onChange={() => toggleItem(item.id)}
                            />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price * item.quantity}</td>
                            <td style={expired[item.id] ? { color: 'gray' } : {}}>
                                {expired[item.id] ? '만료됨' : timeLeft[item.id]}
                            </td>
                            <td><button className="delete-btn" onClick={() => confirmDelete(item.id)}>삭제</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="order-btn" onClick={showOrderPopup}>주문하기</button>

            {popupType && (
                <Popup
                    type={popupType}
                    onCancel={closePopup}
                    onConfirm={() => {
                        if (popupType === 'delete') deleteItem();
                        if (popupType === 'order') {
                            closePopup();
                            navigate('/');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CartGroupBuy;
