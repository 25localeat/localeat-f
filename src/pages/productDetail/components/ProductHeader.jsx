/*
파일명 : ProductHeader.jsx
파일설명 : 상품 상세페이지 상단 헤더 (태그, 상품명, 공동구매/찜 버튼) 컴포넌트
작성자 : 김민하
기간 : 2025-05-02~
*/

import React from 'react';
import TagBadge from '../../../components/Tag/TagBadge';
import { getTagByLabel } from '../../../components/Tag/tags';
import './ProductHeader.css';

export default function ProductHeader({
                                          product,          // { productName, local, productGrade, isGroupBuy, ... }
                                          userRole,         // 'BUYER' | 'SELLER' | null
                                          onGroupBuy,       // () => void
                                          onToggleWish,     // () => void
                                          isWish            // boolean
                                      }) {
    return (
        <div className="product-header">
            {/* 우측 정보 전체 래퍼: 좌측 이미지는 부모에서 배치 */}
            <div className="product-header-info">
                {/* 태그 */}
                <div className="product-tags">
                    <TagBadge {...getTagByLabel(product.local)} />
                    <TagBadge {...getTagByLabel(product.productGrade === 'B' ? 'GOOD' : 'PERFECT')} />
                    {product.isGroupBuy && (
                        <TagBadge {...getTagByLabel('공동구매 가능')} />
                    )}
                </div>

                {/* 제목 + 버튼들 */}
                <div className="product-title-area">
                    <h1 className="product-name">{product.productName}</h1>
                    <div className="product-buttons">
                        {product.isGroupBuy && userRole === 'BUYER' && (
                            <button
                                className="group-buy-button"
                                onClick={onGroupBuy}
                            >
                                공동구매
                            </button>
                        )}
                        <button
                            className="wishlist-button"
                            onClick={onToggleWish}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="-15 0 600 600"
                                fill={isWish ? '#d66' : 'none'}
                                stroke="#d66"
                                strokeWidth="25"
                                className="heart-svg"
                            >
                                <path
                                    d="M471.7 73.1c-54.5-46.4-136-38.3-186.4 13.7L256 116.9l-29.3-30.1C176.3 34.8 94.7 26.7
                     40.3 73.1-13.3 119.5-13.3 203.5 40.3 249.9l198.7 204.3c9.4 9.7 24.6
                     9.7 34 0l198.7-204.3c53.6-46.4 53.6-130.4 0-176.8z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
