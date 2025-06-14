/*
* 상품 판매 페이지 중 - 상품 부분만 모듈로 뺀 코드.
* */
import React from 'react';
import TagBadge from '../../components/Tag/TagBadge';
import {getTagByCode} from '../../components/Tag/tags';
import './ProductMainInfo.css';



const ProductMainInfo = ({
                             product, user, isWish, onWishToggle, purchaseType, setPurchaseType, deliveryCycle,
                             setDeliveryCycle, deliveryPeriodInMonths, setDeliveryPeriodInMonths, quantity, setQuantity,
                             finalPrice, subscribePrice, purchasePrice, onGroupBuy, onCart, onOrder,
                         }) => {
    const isSubscribeSelected = purchaseType === 'subscribe';

    return (
        <div className="product-detail-main">
            <div className="product-image-wrapper">
                <img
                    src={product.imageUrl}
                    alt="상품 이미지"
                    className="product-image"
                />
            </div>

            <div className="product-info">
                <div className="product-tags">
                    <TagBadge {...getTagByCode(product.local)} />
                    <TagBadge {...getTagByCode(product.productGrade)} />
                    {product.isGroupBuy && <TagBadge {...getTagByCode('GROUP_BUY')} />}

                </div>

                <div className="product-title-box">
                    <h1 className="product-name">{product.productName}</h1>
                    <div className="product-buttons">
                        {product.isGroupBuy && (
                            <button
                                className="group-buy-button"
                                onClick={onGroupBuy}
                                disabled={user?.role === 'SELLER'}
                            >
                                공동구매
                            </button>
                        )}
                        <button className="wishlist-button" onClick={onWishToggle} disabled={user?.role === 'SELLER'}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="-15 0 600 600"
                                fill={isWish ? '#d66' : 'none'}
                                stroke="#d66"
                                strokeWidth="25"
                                className="heart-svg"
                            >
                                <path
                                    d="M471.7 73.1c-54.5-46.4-136-38.3-186.4 13.7L256 116.9l-29.3-30.1C176.3 34.8 94.7 26.7 40.3 73.1-13.3 119.5-13.3 203.5 40.3 249.9l198.7 204.3c9.4 9.7 24.6 9.7 34 0l198.7-204.3c53.6-46.4 53.6-130.4 0-176.8z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="price-box">
                    <span className="final-price">{product.price.toLocaleString()}원</span>
                </div>

                <div className="product-info-box">
                    <div className="info-labels">
                        <div>배송비</div>
                    </div>
                    <div className="info-values">
                        <div>{typeof product.deliveryFee === 'number' ? product.deliveryFee.toLocaleString() : ''}원</div>
                    </div>
                </div>

                <div className="purchase-method-box">
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="purchase"
                            value="one-time"
                            checked={purchaseType === 'one-time'}
                            onChange={(e) => setPurchaseType(e.target.value)}
                        />
                        <span className="radio-label">
                            1회 구매
                            <span className="price-text">
                                {typeof purchasePrice === 'number' ? purchasePrice.toLocaleString() : ''}원
                            </span>
                        </span>
                    </label>

                    <label className="radio-option">
                        <input
                            type="radio"
                            name="purchase"
                            value="subscribe"
                            checked={isSubscribeSelected}
                            onChange={(e) => setPurchaseType(e.target.value)}
                        />
                        <span className="radio-label">
                            구독하기
                            <span className="price-text">
                                {typeof subscribePrice === 'number' ? subscribePrice.toLocaleString() : ''}원
                            </span>
                        </span>
                        <span className="badge">{product.subscriptionDiscountRate * 100}% 추가할인</span>
                    </label>
                </div>

                {isSubscribeSelected && (
                    <div className="subscribe-options">
                        <div className="form-group">
                            <label>배송주기</label>
                            <select
                                value={deliveryCycle.cycleType + '_' + deliveryCycle.cycleValue}
                                onChange={(e) => {
                                    const [type, value] = e.target.value.split('_');
                                    setDeliveryCycle({ cycleType: `${type}_${value}`, cycleValue: parseInt(value) });  // 또는 type/value 따로 보낼지 결정
                                }}
                            >
                                <option value="WEEKLY_1">1주</option>
                                <option value="WEEKLY_2">2주</option>
                                <option value="MONTHLY_1">1개월</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>구독기간</label>
                            <select
                                value={deliveryPeriodInMonths}
                                onChange={(e) => setDeliveryPeriodInMonths(parseInt(e.target.value))}
                            >
                                <option value={1}>1개월</option>
                                <option value={3}>3개월</option>
                                <option value={6}>6개월</option>
                                <option value={12}>1년</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="quantity-price-row">
                    <div className="quantity-box">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>
                    <div className="total-price">
                        총 상품금액: {typeof finalPrice === 'number' ? finalPrice.toLocaleString() : ''}원
                    </div>
                </div>

                <div className="purchase-buttons">
                    <button
                        className="cart-button"
                        onClick={onCart}
                        disabled={user?.role === 'SELLER'}
                    >장바구니</button>
                    <button
                        className="purchase-button"
                        onClick={onOrder}
                        disabled={user?.role === 'SELLER'}
                    >
                        {isSubscribeSelected ? '구독하기' : '구매하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductMainInfo;
