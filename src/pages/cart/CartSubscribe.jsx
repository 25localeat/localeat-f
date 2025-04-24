/*
파일명 : CartSubscribe.jsx
파일설명 : 로컬잇 웹사이트의 장바구니/구독독 UI
작성자 : 김소망
기간 : 2025-04-11~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartGeneral.css';
import Popup from '../../components/Ui/Popup/Popup';

const initialSubscribeItems = [
  { id: 1, name: '약과', price: 2000, quantity: 4, cycle: '1주', checked: false },
  { id: 2, name: '약과', price: 5000, quantity: 1, cycle: '2개월', checked: true },
  { id: 3, name: '약과', price: 5000, quantity: 5, cycle: '1주', checked: true },
];

const CartSubscribe = () => {
  const [cartItems, setCartItems] = useState(initialSubscribeItems);
  const [popupType, setPopupType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

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
        <button className="active">구독</button>
        <button onClick={() => navigate('/cart-groupbuy')}>공동구매</button>
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
            <th>배송주기</th>
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
              <td>{item.cycle}</td>
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

export default CartSubscribe;
