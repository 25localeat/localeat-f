import React from 'react';
import TagBadge from '../../components/Tag/TagBadge';
import { getTagByLabel } from '../../components/Tag/tags';
import './ProductMainInfo.css';

const ProductMainInfo = ({
                             product,
                             user,
                             isWish,
                             onWishToggle,
                             purchaseType,
                             setPurchaseType,
                             deliveryCycle,
                             setDeliveryCycle,
                             deliveryPeriodInMonths,
                             setDeliveryPeriodInMonths,
                             quantity,
                             setQuantity,
                             finalPrice,
                             subscribePrice,
                             purchasePrice,
                             onCart,
                             onOrder,
                             onGroupBuy
                         }) => {
    const isSubscribeSelected = purchaseType === 'subscribe';

    return (
        <div className="product-detail-main">

            {/* 이미지 영역 */}
            <div className="product-image-wrapper">
                <img
                    src={product.images[0].imageUrl}
                    alt={product.productName}
                    className="product-image"
                />
            </div>

            {/* 정보 영역 */}
            <div className="product-info">

                {/* 태그 */}
                <div className="product-tags">
                    <TagBadge {...getTagByLabel(product.local)} />
                    <TagBadge {...getTagByLabel(product.productGrade === 'B' ? 'GOOD' : 'PERFECT')} />
                    {product.isGroupBuy && <TagBadge {...getTagByLabel('공동구매 가능')} />}
                </div>

                {/* 상품명 + 버튼 */}
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

                {/* 가격 영역 */}
                <div className="price-box">
                    {product.productGrade === 'B' && (
                        <>
                            <span className="discount-rate">{product.gradeDiscountRate * 100}%</span>
                            <span className="original-price">{product.price.toLocaleString()}원</span>
                        </>
                    )}
                    <span className="final-price">{purchasePrice.toLocaleString()}원</span>
                </div>

                {/* 배송비 / 구독 할인 */}
                <div className="product-info-box">
                    <div className="info-labels">
                        <div>배송비</div>
                        {product.productGrade === 'B' && <div>GOOD</div>}
                    </div>
                    <div className="info-values">
                        <div>{product.deliveryFee.toLocaleString()}원</div>
                        {product.productGrade === 'B' && (
                            <div>{product.gradeDiscountRate * 100}% 할인</div>
                        )}
                    </div>
                </div>

                {/* 구매 방식 라디오 */}
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
                            <span className="price-text">{purchasePrice.toLocaleString()}원</span>
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
                            <span className="price-text">{subscribePrice.toLocaleString()}원</span>
                        </span>
                        <span className="badge">{product.subscriptionDiscountRate * 100}% 추가할인</span>
                    </label>
                </div>

                {/* 구독 옵션 */}
                {isSubscribeSelected && (
                    <div className="subscribe-options">
                        <div className="form-group">
                            <label>배송주기</label>
                            <select
                                value={`${deliveryCycle.cycleType}-${deliveryCycle.cycleValue}`}
                                onChange={(e) => {
                                    const [type, value] = e.target.value.split('-');
                                    setDeliveryCycle({ cycleType: type, cycleValue: parseInt(value) });
                                }}
                            >
                                <option value="WEEKLY-1">1주</option>
                                <option value="WEEKLY-2">2주</option>
                                <option value="MONTHLY-1">1개월</option>
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

                {/* 수량 + 총 금액 */}
                <div className="quantity-price-row">
                    <div className="quantity-box">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>
                    <div className="total-price">총 상품금액: {finalPrice.toLocaleString()}원</div>
                </div>

                {/* 장바구니 / 구매 / 구독 버튼 */}
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
