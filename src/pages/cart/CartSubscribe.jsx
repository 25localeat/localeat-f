/*
파일명 : CartSubscribe.jsx
파일설명 : 로컬잇 웹사이트의 장바구니/구독독 UI
작성자 : 김소망
기간 : 2025-04-11~
*/

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './CartGeneral.css';
import Popup from '../../components/Ui/Popup/Popup';
import axios from "axios";

const CartSubscribe = () => {
  const [cartItems, setCartItems] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();
  // 로그인한 사용자 가져오기
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;


  // 1. 초기 데이터 불러오기
  useEffect(() => {
      if (!userId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

    axios.get(`/api/cart/subscribe/${userId}`)
        .then(res => {
          setCartItems(res.data.map(item => ({
            id: item.cartItemId,
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            cycle: item.deliveryCycle,
            checked: item.isSelected
          })));
            console.log("장바구니 응답 ▶", res.data);
        })
        .catch(err => {
          console.error("구독 장바구니 로딩 실패:", err);
        });
  }, []);

  // 2, 전체 선택/해제 토글
  const toggleAll = (e) => {
    const checked = e.target.checked;
    setCartItems(prev =>
        prev.map(item => ({ ...item, checked }))
    );
    axios.post(`/api/cart/subscribe/toggle-all`, {
      userId,
      selected: checked
    });
  };

  // 3. 개별 항목 선택 토글
  const toggleItem = (id) => {
    const updated = cartItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
    );
    setCartItems(updated);
    const selected = !cartItems.find(item => item.id === id)?.checked;
    axios.post(`/api/cart/subscribe/${id}/toggle?selected=${selected}`);
  };

  //삭제확인하기
  const confirmDelete = (id) => {
    setItemToDelete(id);
    setPopupType('delete');
  };

  // 삭제
  const deleteItem = () => {
    axios.delete(`/api/cart/subscribe/${itemToDelete}`)
        .then(() => {
          setCartItems(prev => prev.filter(item => item.id !== itemToDelete));
          setPopupType(null);
          setItemToDelete(null);
        });
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
