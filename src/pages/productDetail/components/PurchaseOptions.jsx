/*
파일명  : PurchaseOptions.jsx
파일설명 : 상품 상세페이지 구매 옵션(UI) 컴포넌트
작성자  : 김민하
기간    : 2025-05-02~
*/

import React, { useState } from 'react';
import './PurchaseOptions.css';

export default function PurchaseOptions({
                                            product,      // { price, productGrade, subscriptionDiscountRate, ... }
                                            userRole,     // 'BUYER' | 'SELLER'
                                            onAddToCart,  // (type: 'one-time'|'subscribe') => void
                                            onOrder       // (type: 'one-time'|'subscribe') => void
                                        }) {
    const [purchaseType, setPurchaseType] = useState('one-time');
    const isSubscribe = purchaseType === 'subscribe';

    // 배송주기/구독기간 상태
    const [deliveryCycle, setDeliveryCycle] = useState({
        cycleType: 'WEEKLY',
        cycleValue: 1
    });
    const [deliveryPeriodInMonths, setDeliveryPeriodInMonths] = useState(1);

    // 수량 상태
    const [quantity, setQuantity] = useState(1);

    // B급 10% 할인
    const basePrice = product.productGrade === 'B'
        ? Math.floor(product.price * 0.9)
        : product.price;

    // 구독가 (추가 5% 할인 등)
    const subscribePrice = Math.floor(
        basePrice * (1 - product.subscriptionDiscountRate)
    );

    // 총 배송 횟수 계산
    const calculateDeliveryCount = () => {
        if (deliveryCycle.cycleType === 'WEEKLY') {
            return Math.floor((deliveryPeriodInMonths * 4) / deliveryCycle.cycleValue);
        }
        if (deliveryCycle.cycleType === 'MONTHLY') {
            return Math.floor(deliveryPeriodInMonths / deliveryCycle.cycleValue);
        }
        return 0;
    };
    const deliveryCount = calculateDeliveryCount();

    // 최종 합계
    const finalPrice = (isSubscribe ? subscribePrice : basePrice) * quantity;

    // 버튼 핸들러
    const handleCart = () => onAddToCart(purchaseType);
    const handleOrderClick = () => onOrder(purchaseType);

    return (
        <div className="purchase-options">

            {/* 구매 방식 선택 */}
            <div className="purchase-method-box">
                <label className={`radio-option ${!isSubscribe ? 'active' : ''}`}>
                    <input
                        type="radio"
                        name="purchase"
                        value="one-time"
                        checked={!isSubscribe}
                        onChange={() => setPurchaseType('one-time')}
                    />
                    <span className="radio-label">
            1회 구매
            <span className="price-text">{basePrice.toLocaleString()}원</span>
          </span>
                </label>

                <label className={`radio-option ${isSubscribe ? 'active' : ''}`}>
                    <input
                        type="radio"
                        name="purchase"
                        value="subscribe"
                        checked={isSubscribe}
                        onChange={() => setPurchaseType('subscribe')}
                    />
                    <span className="radio-label">
            구독하기
            <span className="price-text">{subscribePrice.toLocaleString()}원</span>
          </span>
                    <span className="badge">
            {(product.subscriptionDiscountRate * 100).toFixed(0)}% 추가할인
          </span>
                </label>
            </div>

            {/* 구독일 때만 배송주기/구독기간 */}
            {isSubscribe && (
                <div className="subscribe-options">
                    <div className="form-group">
                        <label htmlFor="delivery-cycle">배송주기</label>
                        <select
                            id="delivery-cycle"
                            value={`${deliveryCycle.cycleType}-${deliveryCycle.cycleValue}`}
                            onChange={(e) => {
                                const [type, val] = e.target.value.split('-');
                                setDeliveryCycle({
                                    cycleType: type,
                                    cycleValue: parseInt(val, 10)
                                });
                            }}
                        >
                            <option value="WEEKLY-1">1주</option>
                            <option value="WEEKLY-2">2주</option>
                            <option value="MONTHLY-1">1개월</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="delivery-period">구독기간</label>
                        <select
                            id="delivery-period"
                            value={deliveryPeriodInMonths}
                            onChange={(e) => setDeliveryPeriodInMonths(parseInt(e.target.value, 10))}
                        >
                            <option value={1}>1개월</option>
                            <option value={3}>3개월</option>
                            <option value={6}>6개월</option>
                            <option value={12}>1년</option>
                        </select>
                    </div>
                </div>
            )}

            {/* 수량 선택 및 총합 */}
            <div className="quantity-price-row">
                <div className="quantity-box">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <div className="total-price">
                    총 상품금액: {finalPrice.toLocaleString()}원
                </div>
            </div>

            {/* 구독일 때 총 배송 횟수 */}
            {isSubscribe && (
                <div className="delivery-count">
                    총 배송 횟수: {deliveryCount}회
                </div>
            )}

            {/* 장바구니 / (구독)구매 버튼 */}
            <div className="purchase-buttons">
                <button
                    className="cart-button"
                    onClick={handleCart}
                    disabled={userRole === 'SELLER'}
                >
                    {isSubscribe ? '구독 장바구니' : '장바구니'}
                </button>
                <button
                    className="purchase-button"
                    onClick={handleOrderClick}
                    disabled={userRole === 'SELLER'}
                >
                    {isSubscribe ? '구독하기' : '구매하기'}
                </button>
            </div>
        </div>
    );
}
