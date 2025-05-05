/*
파일명: JoinGroupBuy.jsx
파일 설명: 로컬잇 공동구매 참여하기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './JoinGroupBuy.css'
import TagBadge from '../../components/Tag/TagBadge';
import {getTagsByType} from '../../components/Tag/tags';

const product = {
    product_id : 1,
    location:  "서울/인천/경기",
    product_name : "당근",
    max_parti: 20,
}

const groupBuy = {
    description : "공동구매 설명",
    date : "2025-05-05"
};

const RegionTags = ({ tags }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleClick = (index) => {
        setSelectedIndex(index === selectedIndex ? null : index);
    };

    return (
        <div className="region-tags-wrapper">
            <div className="region-tags">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        label={tag.label}       // tag의 label을 넘겨줌
                        bg={tag.bg}             // tag의 bg를 넘겨줌
                        color={tag.color}       // tag의 color를 넘겨줌
                        selected={selectedIndex === index}
                        onClick={() => handleClick(index)}
                    >
                    </div>
                ))}
            </div>
        </div>
    );
};


const JoinGroupBuy = () => {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const regionTags = getTagsByType('region');

    return (
        <div className="jgb-container">
            <p className="jgb-title">공동 구매 참여하기</p>
            <div className="jgb-button-wrapper">
                <Link to="/groupBuy/detail">
                    <button className="jgb-next-button">다음</button>
                </Link>
            </div>
            <div className="jgb-content-wrapper">
                <div className="jgb-left-section">
                    <div className="jgb-section">
                        <p className="jgb-section-title">지역 선택</p>
                        
                    </div>

                    <div className="jgb-section">
                        <p className="jgb-section-title">구매할 수량 선택</p>
                        <div className="jgb-quantity-selector">
                            <div className="jgb-quantity-selector">
                                <button onClick={handleDecrease}>-</button>
                                <span>{quantity}</span>
                                <button onClick={handleIncrease}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="jgb-right-section">
                    <div className="jgb-section">
                        <p className="jgb-section-title">공동 구매 설명</p>
                        <input type="text" className="jgb-input-box" value={`${product.description}`} readOnly />
                    </div>

                    <div className="jgb-section">
                        <p className="jgb-section-title">참여 인원 제한</p>
                        <input
                            type="text"
                            className="jgb-input-box"
                            value={`${product.max_parti}`}
                            readOnly
                        />
                    </div>

                    <div className="jgb-section">
                        <p className="jgb-section-title">마감 시간 선택</p>
                        <input type="text" className="jgb-input-box" value={`${product.date}`} readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGroupBuy;