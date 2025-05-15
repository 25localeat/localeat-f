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
import axios from "axios";

const BuyerReviewManage = () => {
    const [reviews, setReviews] = useState([]);
    const [popupType, setPopupType] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.userId;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/api/reviews/user/${userId}`);
                setReviews(res.data);
            } catch (error) {
                console.error('리뷰 불러오기 실패', error);
            }
        };

        if (userId) fetchReviews();
    }, [userId]);

    const confirmDelete = (id) => {
        setTargetId(id);
        setPopupType('delete');
    };

    const deleteReview = async () => {
        try {
            await axios.delete(`/api/reviews/${targetId}`);
            setReviews(reviews.filter(r => r.id !== targetId));
            setPopupType(null);
            setTargetId(null);
        } catch (error) {
            console.error('리뷰 삭제 실패', error);
        }
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
                                    <td>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span key={s} className={`star-small ${review.rating >= s ? 'filled' : ''}`}>★</span>
                                        ))}
                                    </td>
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
