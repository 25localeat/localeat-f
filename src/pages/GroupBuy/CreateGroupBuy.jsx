/*
파일명: CreateGroupBuy.jsx
파일 설명: 로컬잇 공동구매 만들기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CreateGroupBuy.css'
import TagBadge from '../../components/Tag/TagBadge';
import { getTagsByType } from '../../components/Tag/tags'

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
    // local 값을 한글로 변환
    const localKorean = localMap[local] || local;

    const handleClick = (index) => {
        setSelectedIndex(index === selectedIndex ? null : index);
    };

    const normalize = str => (str || '').trim().replace(/／/g, '/');

    return (
        <div className="cgb-region-tags-wrapper">
            <div className="cgb-region-tags">
                {tags.map((tag, index) => {
                    const isLocalTag = normalize(tag.label) === normalize(localKorean);
                    return (
                        <div
                            key={index}
                            onClick={() => handleClick(index)}
                            className={`cgb-tag-item${isLocalTag ? ' selected' : ''}`}
                        >
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

const CreateGroupBuy = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { productId, productName, imageUrl, local, maxParticipants } = location.state || {};
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

    const handleNext = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.userId;
            if (!userId) throw new Error('로그인이 필요합니다.');

            const response = await axios.post("/groupBuy/create", {
                productId: productId,
                description: description,
                quantity: quantity,
                deadline: deadline,
                local: local
            }, {
                headers: {
                    "X-USER-ID": userId
                }
            });

            navigate('/groupBuy/detail', {
                state: {
                    groupBuyId: response.data.groupBuyId,
                    productId,
                    productName,
                    imageUrl,
                    local
                }
            });
        } catch (error) {
            alert("공동구매 생성 실패: " + (error.response?.data?.message || error.message));
        }
    };


    const regionTags = getTagsByType('region');

    return (
        <div className="cgb-container">
            <p className="cgb-title">공동 구매 만들기</p>
            <div className="cgb-button-wrapper">
                <button className="cgb-next-button" onClick={handleNext}>다음</button>
            </div>
            <div className="cgb-content-wrapper">
                <div className="cgb-left-section">
                    <div className="cgb-section">
                        <p className="cgb-section-title">지역 선택</p>
                        <RegionTags tags={regionTags} local={local} />
                    </div>
                    <div className="cgb-section">
                        <p className="cgb-section-title">구매할 수량 선택</p>
                        <div className="cgb-quantity-selector">
                            <button onClick={handleDecrease}>-</button>
                            <span>{quantity}</span>
                            <button onClick={handleIncrease}>+</button>
                        </div>
                    </div>
                </div>
                <div className="cgb-right-section">
                    <div className="cgb-section">
                        <p className="cgb-section-title">공동 구매 설명</p>
                        <input
                            type="text"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="cgb-input-box"
                            placeholder="간략한 설명 입력칸입니다."
                        />
                    </div>
                    <div className="cgb-section">
                        <p className="cgb-section-title">참여 인원 제한</p>
                        <input
                            type="text"
                            className="cgb-input-box"
                            name="maxParticipants"
                            value={maxParticipants || ""}
                            readOnly
                        />
                    </div>
                    <div className="cgb-section">
                        <p className="cgb-section-title">마감 시간 선택</p>
                        <input
                            type="date"
                            name="deadline"
                            className="cgb-input-box"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupBuy;