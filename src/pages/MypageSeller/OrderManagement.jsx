/* 파일명: OrderManagement.jsx
   설명: 판매자 마이페이지 - 주문 관리 화면
   작성자: 김소망
   작성일: 2025-04-25~ */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderManagement.css';
import Popup from '../../components/Ui/Popup/Popup';
import NavbarSeller from '../../components/Navbar/NavbarSeller';

const OrderManage = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [popupType, setPopupType] = useState(null);
    const statusOptions = ['결제완료', '배송준비중', '배송중', '배송완료'];
    const navigate = useNavigate();

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
        setOrders(savedOrders);
        setProducts(savedProducts);
        setSelectedProduct(savedProducts[0]?.name || '');
    }, []);

    const handleChangeStatus = (index, newStatus) => {
        const updated = [...orders];
        updated[index].status = newStatus;
        setOrders(updated);
    };

    const handleSubmit = () => {
        localStorage.setItem('orders', JSON.stringify(orders));
        setPopupType('statusUpdated');
    };

    const closePopup = () => {
        setPopupType(null);
    };

    const filteredOrders = orders.filter(o => o.productName === selectedProduct);

    return (
        <>
            <NavbarSeller />
            <div className="mypage-wrapper">
                <div className="page-header">마이페이지</div>
                <div className="mypage-body">
                    <div className="sidebar">
                        <ul>
                            <li onClick={() => navigate('/SellerMypage')}>상품 목록</li>
                            <li className="active">주문 관리</li>
                            <li onClick={() => navigate('/mypage/member-edit')}>회원 정보 수정</li>
                        </ul>
                    </div>

                    <div className="container">
                        <h2 className="section-title">주문 관리</h2>

                        <select
                            className="dropdown"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            {products.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>

                        <table>
                            <thead>
                                <tr>
                                    <th>상품이름</th>
                                    <th>공동구매</th>
                                    <th>구독</th>
                                    <th>주문자</th>
                                    <th>주문상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((o, idx) => (
                                    <tr key={idx}>
                                        <td>{o.productName}</td>
                                        <td>{o.groupbuy}</td>
                                        <td>{o.subscribe}</td>
                                        <td>{o.buyer}</td>
                                        <td>
                                            <select
                                                value={o.status}
                                                onChange={(e) => handleChangeStatus(idx, e.target.value)}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button className="complete-btn" onClick={handleSubmit}>완료</button>

                        {popupType && (
                            <Popup
                                type={popupType}
                                onCancel={closePopup}
                                onConfirm={closePopup}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderManage;