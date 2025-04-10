/*
파일명 : Cart_General.jsx
파일설명 : 로컬잇 웹사이트의 장바구니/일반배송 UI
작성자 : 김소망
기간 : 2025-04-10~
*/

import React, { useState } from 'react';
import './CartGeneral.css';

const initialCartItems = [
  { id: 1, name: '약과', price: 2000, quantity: 4, checked: false },
  { id: 2, name: '약과', price: 5000, quantity: 1, checked: true },
  { id: 3, name: '약과', price: 5000, quantity: 5, checked: true },
];

const CartGeneral = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const toggleAll = (e) => {
    const checked = e.target.checked;
    setCartItems(cartItems.map(item => ({ ...item, checked })));
  };

  const toggleItem = (id) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="container">
      <h1>장바구니</h1>

      <div className="flex">
        <button className="active">일반배송</button>
        <button>구독</button>
        <button>공동구매</button>
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
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td><input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} /></td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.price * item.quantity}</td>
              <td><button onClick={() => removeItem(item.id)}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="order-btn">주문하기</button>
    </div>
  );
};

export default CartGeneral;
