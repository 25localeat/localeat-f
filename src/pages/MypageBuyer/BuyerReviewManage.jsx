/* 
파일명 : BuyerReviewManage.jsx
파일설명 : 로컬잇 웹사이트의 구매자 마이페이지/리뷰관리리 UI
작성자 : 김소망
기간 : 2025-04-25~
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/Ui/Popup/Popup';
import './BuyerReviewManage.css';

const BuyerReviewManage = () => {
    const [reviews, setReviews] = useState([]);
    const [popupType, setPopupType] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];
        const myReviews = allReviews.filter(r => r.buyer === user);
        setReviews(myReviews);
    }, []);

    const confirmDelete = (id) => {
        setTargetId(id);
        setPopupType('delete');
    };

    const deleteReview = () => {
        const updated = reviews.filter(r => r.id !== targetId);
        setReviews(updated);
        localStorage.setItem('reviews', JSON.stringify(updated));
        setPopupType(null);
        setTargetId(null);
    };

    const cancelPopup = () => {
        setPopupType(null);
        setTargetId(null);
    };

    return (
        <div className="mypage-wrapper">
            <div className="page-header">마이페이지</div>
            <div className="mypage-body">
                <div className="sidebar">
                    <ul>
                        <li onClick={() => navigate('/mypage/buyer/orders')}>주문 내역</li>
                        <li className="active">리뷰 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/subscribe')}>구독 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/wish')}>찜 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/groupBuy')}>공동구매 현황</li>
                        <li onClick={() => navigate('/mypage/buyer/member-edit')}>회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">리뷰 관리</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>별점</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(review => (
                                <tr key={review.id}>
                                    <td>{review.productName}</td>
                                    <td>{review.rating}</td>
                                    <td><button className="delete-btn" onClick={() => confirmDelete(review.id)}>삭제</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {popupType && (
                <Popup
                    type={popupType}
                    onConfirm={deleteReview}
                    onCancel={cancelPopup}
                />
            )}
        </div>
    );
};

export default BuyerReviewManage;
