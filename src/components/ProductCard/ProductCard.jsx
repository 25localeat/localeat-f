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

const ProductCard = ({ id, image, tags = [], title, price }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products/${id}`);
    };
    console.log(`[렌더링 확인] ${title}의 가격:`, price, typeof price);

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
                <span className="final">{price}원</span>
            </div>
        </div>
    );
};

export default ProductCard;
