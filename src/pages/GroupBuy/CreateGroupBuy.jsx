/*
파일명: CreateGroupBuy.jsx
파일 설명: 로컬잇 공동구매 만들기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateGroupBuy.css'
import TagBadge from '../../components/Tag/TagBadge';
import { getTagsByType } from '../../components/Tag/tags';

const product = {
    product_id: 1,
    location: "서울/인천/경기",
    product_name: "당근",
    max_parti: 20
}

const RegionTags = ({ tags }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleClick = (index) => {
        setSelectedIndex(index === selectedIndex ? null : index);
    };

    return (
        <div className="cgb-region-tags-wrapper">
            <div className="cgb-region-tags">
                {tags.map((tag, index) => (
                    <div key={index} onClick={() => handleClick(index)}>
                        <TagBadge
                            label={tag.label}
                            bg={tag.bg}
                            color={tag.color}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};


const CreateGroupBuy = () => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleNext = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.userId;


            const response = await axios.post("http://localhost:8080/api/groupbuys", {
                productId: 95,
                description: description,
                quantity: quantity,
                deadline: deadline
            }, {
                headers: {
                    "X-USER-ID": userId
                }
            });

            navigate('/groupBuy/detail', {
                state: {
                    groupBuy: response.data
                }
            });

        } catch (error) {
            alert("공동구매 생성 실패: " + error.response?.data?.message || error.message);
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
                        <RegionTags tags={regionTags} />
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
                            name="max_parti"
                            value={`${product.max_parti}`}
                            readOnly
                        />
                    </div>

                    <div className="cgb-section">
                        <p className="cgb-section-title">마감 시간 선택</p>
                        <input
                            type="date"
                            name="date"
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