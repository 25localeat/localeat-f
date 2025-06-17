/* 파일명: OrderManagement.jsx
   설명: 판매자 마이페이지 - 주문 관리 화면
   작성자: 김소망
   작성일: 2025-04-25~ */

import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './OrderManagement.css';
import Popup from '../../components/Ui/Popup/Popup';
import NavbarSeller from '../../components/Navbar/NavbarSeller';
import axios from 'axios';

const OrderManage = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [popupType, setPopupType] = useState(null);
    const navigate = useNavigate();

    const getPurchaseType = (order) => {
        if (order.subscribe) return '구독';
        if (order.groupbuy) return '공동구매';
        return '일반구매';
    };

    const statusOptions = [
        { label: '결제완료', value: 'PAID' },
        { label: '배송준비중', value: 'READY' },
        { label: '배송중', value: 'DELIVERING' },
        { label: '배송완료', value: 'DELIVERED' },
    ];

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const sellerId = user?.userId;

        if (!sellerId) return;

        axios.get(`/api/seller/orders?sellerId=${sellerId}`)
            .then(res => {
                console.log("응답 데이터 확인:", res.data);
                const sorted = [...res.data].sort((a, b) =>
                    new Date(b.orderDate) - new Date(a.orderDate)
                );

                setOrders(sorted);

                const uniqueProducts = Array.from(new Set(res.data.map(o => o.productName)));
                setProducts(uniqueProducts);
                setSelectedProduct(uniqueProducts[0] || '');
            })
            .catch(err => {
                console.error("주문 목록 불러오기 실패", err);
            });
    }, []);

    const handleChangeStatus = (orderItemId, newStatus) => {
        const updated = orders.map(order =>
            order.orderItemId === orderItemId
                ? { ...order, status: newStatus }
                : order
        );
        setOrders(updated);
    };

    const handleSubmit = () => {
        const updateRequests = orders.map(o =>
            axios.put(`/api/seller/orders/${o.orderItemId}`, {
                status: o.status
            })
        );

        Promise.all(updateRequests)
            .then(() => {
                console.log("전체 상태 변경 완료");
                setPopupType('statusUpdated');
            })
            .catch(err => {
                console.error("상태 변경 실패", err);
            });
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
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        <table>
                            <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>주문방식</th>
                                <th>수량</th>
                                <th>결제금액</th>
                                <th>주문일자</th>
                                <th>주문자</th>
                                <th>주문상태</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOrders.map((o) => (
                                <tr key={o.orderItemId}>
                                    <td>
                                        <Link className="plain-link" to={`/products/${o.productId}`}>
                                            {o.productName}
                                        </Link>
                                    </td>
                                    <td>{getPurchaseType(o)}</td>
                                    <td>{o.quantity}</td>
                                    <td>{o.price.toLocaleString()}원</td>
                                    <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                                    <td>{o.buyer}</td>
                                    <td>
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleChangeStatus(o.orderItemId, e.target.value)}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
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