/*
파일명 : CartGeneral.jsx
파일설명 : 로컬잇 웹사이트의 장바구니/일반배송 UI
작성자 : 김소망
기간 : 2025-04-10~
*/

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './CartGeneral.css';
import Popup from '../../components/Ui/Popup/Popup'; // 팝업 따로 했어여!
import axios from "axios";

const CartGeneral = () => {
  const [cartItems, setCartItems] = useState([]);
  const [popupType, setPopupType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  // 로그인 유저 추가 - mh
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.userId;

  // 장바구니 목록 호출 부분 추가 - mh
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get('/api/general-cart/items', {
          headers: { userId }
        });
        const itemsWithChecked = res.data.map(item => ({ ...item, checked: true }));
        setCartItems(itemsWithChecked);
      } catch (error) {
        console.error('장바구니 불러오기 실패:', error);
      }
    };

    if (userId) fetchCartItems();
  }, [userId]);

  const toggleAll = (e) => {
    const checked = e.target.checked;
    setCartItems(cartItems.map(item => ({ ...item, checked })));
  };

  const toggleItem = (cartItemId) => {
    setCartItems(cartItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, checked: !item.checked } : item
    ));
  };

  // 삭제 버튼 클릭시 팝업 
  const confirmDelete = (id) => {
    setItemToDelete(id);
    setPopupType('delete');
  };

  // 삭제 서버 요청 수정 - mh
  const deleteItem = async () => {
    try {
      await axios.delete(`/api/general-cart/items/${itemToDelete}`);
      await fetchCartItemsAgain();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제할 수 없습니다. 이미 연결된 주문 내역이 있습니다.');
    } finally {
      setPopupType(null);
      setItemToDelete(null);
    }
  };
  const fetchCartItemsAgain = async () => {
    try {
      const res = await axios.get('/api/general-cart/items', { headers: { userId } });
      const itemsWithChecked = res.data.map(item => ({ ...item, checked: true }));
      setCartItems(itemsWithChecked);
    } catch (error) {
      console.error('장바구니 불러오기 실패:', error);
    }
  };


  //주문 버튼 클릭시 팝업
  const showOrderPopup = () => {
    setPopupType('order');
  };

  const closePopup = () => {
    setPopupType(null);
    setItemToDelete(null);
  };

  // 주문 서버 요청 추가 - mh
  const handleOrder = async () => {
    const selectedItemIds = cartItems.filter(item => item.checked).map(item => item.cartItemId);

    if (selectedItemIds.length === 0) {
      alert('주문할 항목을 선택해 주세요.');
      return;
    }

    try {
      await axios.post('/api/general-cart/order', { cartItemIds: selectedItemIds }, {
        headers: { userId }
      });
      navigate('/mypage/buyer/orders');
    } catch (error) {
      console.error('주문 실패:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container">
      <h1>장바구니</h1>

      <div className="flex">
        <button className="active">일반배송</button>
        <button onClick={() => navigate('/cart-subscribe')}>구독</button>
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
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
        {cartItems.map(item => {
          const finalUnitPrice = item.productGrade === 'B'
              ? Math.floor(item.price * (1 - item.gradeDiscountRate))
              : item.price;

          return (
              <tr key={item.cartItemId}>
                <td>
                  <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={() => toggleItem(item.cartItemId)}
                  />
                </td>
                <td>{item.productName}</td>
                <td>{finalUnitPrice}</td>
                <td>{item.quantity}</td>
                <td>{finalUnitPrice * item.quantity}</td>
                <td>
                  <button className="delete-btn" onClick={() => confirmDelete(item.cartItemId)}>삭제</button>
                </td>
              </tr>
          );
        })}
        </tbody>

      </table>

      <button className="order-btn" onClick={showOrderPopup}>주문하기</button>

      {popupType && (
          <Popup
              type={popupType}
              onCancel={closePopup}
              onConfirm={() => {
                if (popupType === 'delete') deleteItem();
                if (popupType === 'order') handleOrder();
              }}
          />
      )}
    </div>
  );
};

export default CartGeneral;
