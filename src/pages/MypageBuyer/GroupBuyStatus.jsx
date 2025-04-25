// 파일명: GroupBuyStatus.jsx
// 설명: 구매자 마이페이지 - 공동구매 현황

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupBuyStatus.css';

const GroupBuyStatus = () => {
    const navigate = useNavigate();
    const [groupBuys, setGroupBuys] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const allGroupBuys = JSON.parse(localStorage.getItem('groupBuys')) || [];
        const today = new Date().toISOString().slice(0, 10);

        const filtered = allGroupBuys
            .filter(gb => gb.buyer === user && gb.deadline >= today)
            .map(gb => ({
                ...gb,
                current: parseInt(gb.current),
                target: parseInt(gb.target)
            }));

        setGroupBuys(filtered);
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
                            {groupBuys.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product}</td>
                                    <td>{item.current}/{item.target}</td>
                                    <td>{item.deadline}</td>
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
