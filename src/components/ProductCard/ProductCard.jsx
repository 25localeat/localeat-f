/*
파일명 : ProductCard.jsx
파일설명 : 상품 카드 UI 컴포넌트. 상품 이미지, 태그, 가격 정보등을 포함함.
작성자 : 정여진
기간 : 2025-04-10.
*/
import './ProductCard.css';

const ProductCard = ({ image, tags, title, originalPrice, discountPrice }) => {
    return (
        <div className="product-card">
            <img className="product-img" src={image} alt={title} />

            <div className="tag-list">
                {tags.map((tag, i) => (
                    <div key={i} className="product-tag" style={{ backgroundColor: tag.bg }}>
                        <span style={{ color: tag.color }}>#{tag.label}</span>
                    </div>
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
