/*
파일명: GroupBuyDetail.jsx
파일 설명: 로컬잇 공동구매 상세 정보 보기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/
import React from 'react';
import { Link } from 'react-router-dom';
import './GroupBuyDetail.css'

const product = {
    product_id : 1,
    location:  "서울/인천/경기",
    product_name : "당근",
    time: "23:59:59"
   };


const list = [
    {
        groupBuyId : 1,
        location : "서울/인천/경기",
        product_name : "당근",
        max_parti : 20,
        parti_count : 2,
        description: "싸고 품질 좋음.",
        participants: [{
            id: "mhyeon",
            buy: 5
        },
        {
            id: "wish",
            buy: 4
        }
    ],},
];

const GroupBuyDetail = () => {
    return (
        <div className="container">
            <p className="title">공동 구매 상세 정보</p>
                <p className="sub">내가 참여한 공동 구매의 정보, 마감 시간 등을 확인해 보세요</p>
                <p className="time-guide">공동구매 성사까지 남은 시간 {product.time}</p>
                <div className="groupBuy-box">
                    <div className = "header-section">
                        <div className="img-wrapper">
                            <img className="product-image" src={product.image} alt="당근"/>
                        </div>
                        <div className="product-info">
                            <div className="top-row">
                                <p className="product-name">{product.product_name}</p>
                            </div>
                            <p className="groupBuy-description">{product.description}</p>
                        </div>
                    </div>

                    <hr className="divider" />

                    <div className="list-wrapper">
                        <p className="participants">참여인원</p>
                            <p className="count">( {list.parti_count} / {list.max_parti})</p>
                            {list.participants.map((item) => (
                                <div key={item.id} className="list">
                                    <p className="list-text">
                                        아이디: {item.id} / 구매 수량: {item.buy}개
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
    );
};

export default GroupBuyDetail;