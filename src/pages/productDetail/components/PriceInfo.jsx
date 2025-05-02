/*
파일명   : PriceInfo.jsx
파일설명 : 상품 상세페이지 가격 정보 컴포넌트 (할인율 · 원가 · 최종가)
작성자   : 김민하
기간     : 2025-05-02~
*/

import React from 'react';
import './PriceInfo.css';

export default function PriceInfo({
                                      originalPrice,   // number: 상품 원가
                                      discountRate,    // number: B급일 때 10, 아니면 0
                                      finalPrice       // number: 할인 적용 후 최종 가격
                                  }) {
    return (
        <div className="price-box">
            {discountRate > 0 && (
                <>
          <span className="discount-rate">
            {discountRate}%
          </span>
                    <span className="original-price">
            {originalPrice.toLocaleString()}원
          </span>
                </>
            )}
            <span className="final-price">
        {finalPrice.toLocaleString()}원
      </span>
        </div>
    );
}
