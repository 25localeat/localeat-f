/*
파일명: JoinGroupBuy.jsx
파일 설명: 로컬잇 공동구매 참여하기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinGroupBuy.css'
import TagBadge from '../../components/Tag/TagBadge';
import { getTagsByType } from '../../components/Tag/tags';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// 영어 지역명과 한글 태그명 매핑
const localMap = {
    'SGI': '서울/경기/인천',
    'GANGWON': '강원',
    'CHUNGCHEONG': '충청',
    'JEONBUK': '전북',
    'JNGJ': '전남/광주',
    'DGGB': '대구/경북',
    'GNBNUL': '경남/부산/울산',
    'JEJU': '제주'
};

const RegionTags = ({ tags, local }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const localKorean = localMap[local] || local;
    const normalize = str => (str || '').trim().replace(/／/g, '/');
    const handleClick = (index) => {
        setSelectedIndex(index === selectedIndex ? null : index);
    };
    return (
        <div className="jgb-region-tags-wrapper">
            <div className="jgb-region-tags">
                {tags.map((tag, index) => {
                    const isLocalTag = normalize(tag.label) === normalize(localKorean);
                    return (
                        <div key={index} onClick={() => handleClick(index)}>
                            <TagBadge
                                label={tag.label}
                                bg={isLocalTag ? tag.bg.replace(/0\.[0-9]+\)/, '1)') : tag.bg}
                                color={isLocalTag ? '#000' : tag.color}
                                style={isLocalTag ? { fontWeight: 'bold' } : {}}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const JoinGroupBuy = () => {
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const { groupBuyId, productId, productName, imageUrl, local, maxParticipants, description, deadline } = location.state || {};

    const handleNext = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.userId;

            await axios.post("/groupBuy/join", {
                groupBuyId: groupBuyId,
                productId: productId,
                quantity: quantity
            }, {
                headers: {
                    "X-USER-ID": userId
                }
            });
            navigate('/groupBuy/detail', {
                state: {
                    groupBuyId,
                    productId,
                    productName,
                    imageUrl,
                    local,
                    maxParticipants,
                    description,
                    deadline
                }
            });

        } catch (error) {
            console.error("공동구매 참여 실패:", error);
        }
    };

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
                <button className="jgb-next-button" onClick={handleNext}>다음</button>
            </div>
            <div className="jgb-content-wrapper">
                <div className="jgb-left-section">
                    <div className="jgb-section">
                        <p className="jgb-section-title">지역 선택</p>
                        <RegionTags tags={regionTags} local={local} />
                    </div>

                    <div className="jgb-section">
                        <p className="jgb-section-title">구매할 수량 선택</p>
                        <div className="jgb-quantity-selector">
                            <button onClick={handleDecrease}>-</button>
                            <span>{quantity}</span>
                            <button onClick={handleIncrease}>+</button>
                        </div>
                    </div>
                </div>

                <div className="jgb-right-section">
                    <div className="jgb-section">
                        <p className="jgb-section-title">공동 구매 설명</p>
                        <input type="text" className="jgb-input-box" value={description || ""} readOnly />
                    </div>

                    <div className="jgb-section">
                        <p className="jgb-section-title">참여 인원 제한</p>
                        <input
                            type="text"
                            className="jgb-input-box"
                            value={maxParticipants || ""}
                            readOnly
                        />
                    </div>

                    <div className="jgb-section">
                        <p className="jgb-section-title">마감 시간</p>
                        <input type="text" className="jgb-input-box" value={deadline || ""} readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGroupBuy;