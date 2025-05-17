/*
파일명 : ProductCard.jsx
파일설명 : 상품 카드 UI 컴포넌트. 상품 이미지, 태그, 가격 정보등을 포함함.
작성자 : 정여진
기간 : 2025-04-10.
*/
import './ProductCard.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import carrotImg from '../../pages/home/carrot.png';
import TagBadge from '../Tag/TagBadge';

const ProductCard = ({ id, image, tags = [], title, originalPrice, discountPrice, local }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (storedUser.local !== local) {
            alert("해당 상품은 회원님의 지역과 일치하지 않아 구매할 수 없습니다.");
            return;
        }

        navigate(`/products/${id}`);
    };

    return (
        <div className="product-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img
                src={image}
                alt={title}
                onError={(e) => { e.target.src = carrotImg; }}
            />


            <div className="tag-list">
                {tags.map((tag, i) => (
                    <TagBadge key={i} label={tag.label} bg={tag.bg} color={tag.color} />
                ))}
            </div>

            <div className="product-title">{title}</div>

            <div className="product-price">
                <span className="original">{originalPrice}원</span>
                <span className="discount">{discountPrice}원</span>
            </div>
        </div>
    );
};

export default ProductCard;
