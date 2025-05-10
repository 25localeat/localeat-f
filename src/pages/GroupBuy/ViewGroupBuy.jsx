/*
파일명: ViewGroupBuy.css
파일 설명: 로컬잇 공동구매 전체 보기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewGroupBuy.css'
import carrotImg from './carrot.png';

const product = {
    product_id: 1,
    image: carrotImg,
    location: "서울/인천/경기",
    product_name: "당근"
};


const groupBuyList = [
    {
        groupBuyId: 1,
        location: "서울/인천/경기",
        product_name: "당근",
        max_parti: 20,
        parti_count: 8
    },
    {
        groupBuyId: 2,
        location: "서울/경기/인천",
        product_name: "당근",
        max_parti: 20,
        parti_count: 11
    }
];

const ViewGroupBuy = () => {
    const navigate = useNavigate();


    const handleDetailClick = () => {
        navigate('/groupBuy/detail');
    }

    const handleCreateClick = () => {
        navigate('/groupBuy/create');
    }

    const handleJoinClick = () => {
        navigate('/groupBuy/join');
    }

    return (
        <div className="vgb-container">
            <p className="vgb-title">공동 구매</p>
            <div className="vgb-box">
                <div className="vgb-header-section">
                    <div className="vgb-img-wrapper">
                        <img className="vgb-product-image" src={product.image} alt="당근" />
                    </div>
                    <div className="vgb-product-info">
                        <div className="vgb-top-row">
                            <p className="vgb-product-name">{product.product_name}</p>
                            <button className="vgb-create-button" onClick={handleCreateClick}>공동구매 만들기</button>
                        </div>
                        <p className="vgb-guide">현재 상품에 대한 공동구매 진행 건은 다음과 같습니다.</p>
                    </div>
                </div>

                <hr className="vgb-divider" />

                <div className="vgb-list-wrapper">
                    {groupBuyList.map((item) => (
                        <div key={item.groupBuyId} className="vgb-list">
                            <p className="vgb-list-text" onClick={handleDetailClick}>
                                지역: {item.location} 상품명: {item.product_name} 모집인원 {item.parti_count}/{item.max_parti}
                            </p>
                            <button className="vgb-join-button" onClick={handleJoinClick}>참여하기</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewGroupBuy;