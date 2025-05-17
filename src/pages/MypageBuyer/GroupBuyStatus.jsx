// 파일명: GroupBuyStatus.jsx
// 설명: 구매자 마이페이지 - 공동구매 현황

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './GroupBuyStatus.css';

const GroupBuyStatus = () => {
    const navigate = useNavigate();
    const [groupBuys, setGroupBuys] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.userId;

        axios.get('http://localhost:8080/groupBuy/my', {
            headers: { 'X-USER-ID': userId }
        })
            .then(res => {
                setGroupBuys(res.data);
            })
            .catch(err => {
                console.error('공동구매 현황 불러오기 실패', err);
                alert('공동구매 현황 불러오기 실패');
            });
    }, []);

    return (
        <div className="mypage-wrapper">
            <div className="page-header">마이페이지</div>
            <div className="mypage-body">
                <div className="sidebar">
                    <ul>
                        <li onClick={() => navigate('/mypage/buyer/orders')}>주문 내역</li>
                        <li onClick={() => navigate('/mypage/buyer/review')}>리뷰 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/subscribe')}>구독 관리</li>
                        <li onClick={() => navigate('/mypage/buyer/wish')}>찜 관리</li>
                        <li className="active">공동구매 현황</li>
                        <li onClick={() => navigate('/mypage/buyer/member-edit')}>회원 정보 수정</li>
                    </ul>
                </div>

                <div className="container">
                    <h2 className="section-title">공동 구매 현황</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>상품이름</th>
                                <th>참여자</th>
                                <th>마감일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupBuys.map(gb => (
                                <tr key={gb.groupBuyId}>
                                    <td>
                                        <Link className="plain-link" to={`/products/${gb.productId}`}>
                                            {gb.productName}
                                        </Link>
                                    </td>
                                    <td>{gb.currentCount}/{gb.maxParticipants}</td>
                                    <td>{gb.deadline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GroupBuyStatus;
