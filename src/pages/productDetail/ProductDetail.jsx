/*
파일명 : ProductDetail.jsx
파일설명 : 로컬잇 웹사이트의 상품 상세페이지 UI
작성자 : 김민하
기간 : 2025-04-10~
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductHeader     from './components/ProductHeader';
import PriceInfo         from './components/PriceInfo';
import PurchaseOptions   from './components/PurchaseOptions';
import './ProductDetail.css';

import tomatoImg from './tomato.png';

export default function ProductDetail() {
    const navigate = useNavigate();

    // ——————————————————————
    // 1) 임시 데이터 세팅 (나중에 API 연동)
    // ——————————————————————
    const [product, setProduct] = useState(null);
    const [user, setUser]       = useState(null);
    const [isWish, setIsWish]   = useState(false);

    useEffect(() => {
        setProduct({
            productId: 1,
            productName: '싱싱한 토마토',
            description: '지역 농장에서 갓 수확한 신선한 토마토입니다.',
            price: 10000,
            productGrade: 'B',
            isGroupBuy: true,
            isSubscription: false,
            subscriptionDiscountRate: 0.1,
            deliveryFee: 3000,
            local: '서울/경기/인천',
            image: tomatoImg,
        });
        setUser({
            id: 'testUser',
            role: 'BUYER',      // BUYER / SELLER
            isLoggedIn: true    // 로그인 테스트
        });
    }, []);

    if (!product || !user) return null;

    // ——————————————————————
    // 2) 핸들러들
    // ——————————————————————
    const handleGroupBuy   = () => navigate('/groupbuy/detail');
    const handleToggleWish = () => setIsWish(w => !w);
    const handleAddToCart  = (type) => console.log('장바구니:', type);
    const handleOrder      = (type) => console.log('주문하기:', type);

    return (
        <div className="product-detail-page">

            <div className="product-detail-main">
                {/* 좌측: 상품 이미지 */}
                <div className="product-image-wrapper">
                    <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="product-image"
                    />
                </div>

                {/* 우측: 헤더 + 가격 정보 + 옵션 */}
                <div className="detail-right">

                    {/* 1) 태그·상품명·버튼 */}
                    <ProductHeader
                        product={product}
                        userRole={user.role}
                        isWish={isWish}
                        onGroupBuy={handleGroupBuy}
                        onToggleWish={handleToggleWish}
                    />

                    {/* 2) 할인율·원가·최종가 */}
                    <PriceInfo
                        originalPrice={product.price}
                        discountRate={product.productGrade === 'B' ? 10 : 0}
                        finalPrice={Math.floor(
                            (product.productGrade === 'B'
                                ? product.price * 0.9
                                : product.price)
                        )}
                    />

                    {/* 3) 구매 옵션 (라디오·수량·장바구니·구매) */}
                    <PurchaseOptions
                        product={product}
                        userRole={user.role}
                        onAddToCart={handleAddToCart}
                        onOrder={handleOrder}
                    />

                </div>
            </div>

            {/* ─── 탭 이하 생략 ─── */}
        </div>
    );
}

