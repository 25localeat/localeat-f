/* 
파일명 : WishlistManage.jsx
파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/찜관리 UI
작성자 : 김소망
기간 : 2025-04-25~
*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WishlistManage.css';
import Popup from '../../components/Ui/Popup/Popup';

const WishlistManage = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [popupType, setPopupType] = useState(null);
    const [targetIndex, setTargetIndex] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const all = JSON.parse(localStorage.getItem('wishlist')) || [];
        const filtered = all.filter(item => item.buyer === user);
        setWishlist(filtered);
    }, []);

    const confirmDelete = (index) => {
        setTargetIndex(index);
        setPopupType('delete');
    };

    const deleteItem = () => {
        const updated = [...wishlist];
        updated.splice(targetIndex, 1);
        setWishlist(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setPopupType(null);
    };

    const closePopup = () => {
        setPopupType(null);
        setTargetIndex(null);
    };

    return (
        <div className="mypage-wrapper">
            <div className="page-header">마이페이지</div>

            <div className="mypage-body">
                <div className="sidebar">
                    <ul>
                        <li onClick={() => navigate('/mypage/buyer/orders')}>주문 내역</li>
                        <li onClick={() => navigate('/mypage/buyer/review')}>리뷰 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/subscribe')}>구독 관리</li>
                        <li className="active">찜 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/groupBuy')}>공동구매 현황</li>
                        <li onClick={() => navigate('/mypage/buyer/member-edit')}>회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">찜 관리</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlist.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => confirmDelete(index)}>
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {popupType && (
                <Popup
                    type="delete"
                    onConfirm={deleteItem}
                    onCancel={closePopup}
                />
            )}
        </div>
    );
};

export default WishlistManage;
