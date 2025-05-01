/*
파일명 : ProductDetail.jsx
파일설명 : 로컬잇 웹사이트의 상품 상세페이지 UI
작성자 : 김민하
기간 : 2025-04-10~
*/
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import TagBadge from '../../components/Tag/TagBadge';
import {getTagByLabel} from '../../components/Tag/tags';
import tomatoImg from './tomato.png';
import Popup from "../../components/Ui/Popup/Popup";

export default function ProductDetail() {
    const navigate = useNavigate();
    // 구매 타입 상태: 'one-time' or 'subscribe'
    const [purchaseType, setPurchaseType] = useState('one-time');
    const [quantity, setQuantity] = useState(1);
    const [deliveryCycle, setDeliveryCycle] = useState({
        cycleType: 'WEEKLY',
        cycleValue: 1
    });
    const [deliveryPeriodInMonths, setDeliveryPeriodInMonths] = useState(1);
    const [isWish, setIsWish] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [activeTab, setActiveTab] = useState('detail');
    // 리뷰 정렬 기준: 'latest' 또는 'rating'
    const [sortBy, setSortBy] = useState('latest');

    // 임시
    const product = {
        productId: 1,
        productName: "싱싱한 토마토",
        price: 10000,
        subscriptionDiscountRate: 0.1,
        isSubscription: true,
        isGroupBuy: true,
        local: "서울/경기/인천",
        productGrade: "B",
        deliveryFee: 3000,
        description: "지역 농장에서 갓 수확한 신선한 토마토입니다.",
        images: [
            { imageId: 1, imageUrl: tomatoImg }
        ]
    };
    const user = {
        isLoggedIn: true,
        role: 'CONSUMER', //'SELLER',
        userId: '',
    }

    // --- 리뷰 데이터 (임시) ---
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reviewData = [
        {
            reviewId: 1,
            product: { productId: product.productId },
            user: { userId: 'taelo062' },
            rating: 5,
            reviewContent: '정말 신선해요! 토마토 특유의 단맛이 살아있습니다.',
            images: ['/images/review1-1.jpg','/images/review1-2.jpg'],
            createdAt: '2025-03-19T18:45:00'
        },
        {
            reviewId: 2,
            product: { productId: product.productId },
            user: { userId: 'wish23' },
            rating: 4,
            reviewContent: '맛 괜찮네요. 다음에는 좀 더 큰 사이즈로…',
            images: [],
            createdAt: '2025-03-22T10:00:00'
        },
        {
            reviewId: 3,
            product: { productId: product.productId },
            user: { userId: 'somang12' },
            rating: 5,
            reviewContent: '정말 맛있어서 재구매했습니다!',
            images: ['/images/review3.jpg'],
            createdAt: '2025-03-20T15:30:00'
        },
    ];
    const reviewCount = reviewData.length;
    // --- 문의 데이터 (임시) ---
    const [inquiries, setInquiries] = useState([
        {
            inquiryId: 1,
            product: { productId: product.productId },
            user: { userId: 'keri1015' },
            category: 'PRODUCT',
            inquiryContent: '이 상품은 신선도 보증이 되나요?',
            answer: '네, 당일 수확한 상품만 출고합니다.',
            createdAt: '2025-03-25T14:30:00',
            answeredAt: '2025-03-26T09:00:00',
        },
        {
            inquiryId: 2,
            product: { productId: product.productId },
            user: { userId: 'lee0012' },
            category: 'DELIVERY',
            inquiryContent: '토마토 오늘 시키면 언제 배송오나요?',
            answer: '',
            createdAt: '2025-03-27T11:15:00',
            answeredAt: null,
        },
    ]);
    const inquiryCount = inquiries.length;

    const handleToggleWish = () => {
        if (!user.isLoggedIn) {
            setShowLoginPopup(true);
            return;
        }
        setIsWish(prev => !prev);
    };

    const handleCart = () => {
        if (!user.isLoggedIn) {
            setShowLoginPopup(true);
            return;
        }

        if (isSubscribeSelected) {
            navigate('/cart-subscribe');
        } else {
            navigate('/cart');
        }
    };

    const handleOrder = () => {
        if (!user.isLoggedIn) {
            setShowLoginPopup(true);
            return;
        }

        if (isSubscribeSelected) {
            navigate('/mypage/buyer/subscribe');
        } else {
            navigate('/mypage/buyer/orders');
        }
    };

    const handleGroupBuy = () => {
        if (!user.isLoggedIn) {
            setShowLoginPopup(true);
            return;
        }

        // 미현님 코드 확인 후 수정
        navigate('/groupBuy/detail');
    };

    const discountRate = 10;
    const discountPrice = product.productGrade === 'B'
        ? Math.floor(product.price * 0.9)
        : product.price;

    const subscribePrice = Math.floor(product.price * 0.9 * (1 - product.subscriptionDiscountRate));

    const isSubscribeSelected = purchaseType === 'subscribe';

    const finalPrice = isSubscribeSelected
        ? Math.floor(discountPrice * (1 - product.subscriptionDiscountRate)) * quantity
        : discountPrice * quantity;

    // 평균 평점 (소수점 둘째 자리까지)
    const averageRating = parseFloat(
        (reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2)
    );

    // 별점별 분포 계산
    const ratingDistribution = [5,4,3,2,1].map(star => {
        const count = reviewData.filter(r => r.rating === star).length;
        return {
            star,
            count,
            percent: reviewCount === 0 ? 0 : Math.round((count / reviewCount) * 100)
        };
    });

    // 유저 아이디 가리기
    const maskUserId = (id) => {
        if (!id) return '';
        const visible = id.slice(0, 3);
        const hiddenCount = Math.max(0, id.length - 3);
        return visible + '*'.repeat(hiddenCount);
    };
    // sortedReviews 정의
    const sortedReviews = useMemo(() => {
        // 원본 훼손 방지
        const arr = [...reviewData];
        if (sortBy === 'rating') {
            // 평점 내림차순, 동점이면 생성일 최신순으로
            arr.sort((a, b) => {
                if (b.rating !== a.rating) {
                    return b.rating - a.rating;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } else {
            // 최신순: 생성일 내림차순
            arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return arr;
    }, [reviewData, sortBy]);

    // 폼 토글 & 입력값 상태
    const [isAskFormVisible, setIsAskFormVisible] = useState(false);
    const [askCategory, setAskCategory] = useState('PRODUCT');
    const [askContent, setAskContent] = useState('');

    // 답변 폼 토글 & 입력값 상태 (inquiryId → bool/string)
    const [answerFormVisible, setAnswerFormVisible] = useState({});
    const [answerInputs, setAnswerInputs] = useState({});

    // 최신순으로 정렬
    const sortedInquiries =
        [...inquiries].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 문의 “작성하기” 버튼 클릭
    const handleAskClick = () => {
        if (!user.isLoggedIn) {
            setShowLoginPopup(true);
            return;
        }
        if (user.role !== 'CONSUMER') return; // 판매자 등 비활성
        setIsAskFormVisible(prev => !prev);
    };

    // 문의 등록
    const handleAskSubmit = () => {
        if (!askContent.trim()) return;
        const now = new Date().toISOString();
        const newInq = {
            inquiryId: Date.now(),
            category: askCategory,
            inquiryContent: askContent,
            answer: '',
            createdAt: now,
            answeredAt: null,
            user: { userId: user.userId },
        };
        setInquiries([newInq, ...inquiries]);
        setIsAskFormVisible(false);
        setAskContent('');
        setAskCategory('PRODUCT');
    };

    // 답변폼 토글
    const toggleAnswerForm = (id) => {
        setAnswerFormVisible(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // 답변 입력 핸들
    const handleAnswerChange = (id, text) => {
        setAnswerInputs(prev => ({ ...prev, [id]: text }));
    };

    // 답변 등록
    const handleAnswerSubmit = (id) => {
        const answerText = answerInputs[id]?.trim();
        if (!answerText) return;
        setInquiries(prev =>
            prev.map(inq =>
                inq.inquiryId === id
                    ? { ...inq, answer: answerText, answeredAt: new Date().toISOString() }
                    : inq
            )
        );
        setAnswerFormVisible(prev => ({ ...prev, [id]: false }));
        setAnswerInputs(prev => ({ ...prev, [id]: '' }));
    };

    return (
        <div className="product-detail-page">

            {/*상품 상단 메인*/}
            <div className="product-detail-main">

                <div className="product-image-wrapper">
                    <img src={product.images[0].imageUrl} alt={product.productName} className="product-image" />
                </div>

                <div className="product-info">

                    <div className="product-tags">
                        <TagBadge {...getTagByLabel(product.local)} />
                        <TagBadge {...getTagByLabel(product.productGrade === 'B' ? 'GOOD' : 'PERFECT')} />
                        {product.isGroupBuy && <TagBadge {...getTagByLabel('공동구매 가능')} />}
                    </div>

                    {/* 왼쪽: 상품명 / 오른쪽: 공동구매 버튼 + 찜 버튼*/}
                    <div className="product-title-box">

                        <h1 className="product-name">{product.productName}</h1>

                        <div className="product-buttons">
                            {product.isGroupBuy && (
                                <button className="group-buy-button" onClick={handleGroupBuy} disabled={user.role === 'SELLER'}>
                                    공동구매
                                </button>
                            )}
                            <button className="wishlist-button" onClick={handleToggleWish} disabled={user.role === 'SELLER'}>
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
                                <span className="discount-rate">{discountRate}%</span>
                                <span className="original-price">{product.price.toLocaleString()}원</span>
                            </>
                        )}
                        <span className="final-price">{discountPrice.toLocaleString()}원</span>
                    </div>

                    {/* 배송비 / 구독할인 안내 */}
                    <div className="product-info-box">
                        <div className="info-labels">
                            <div>배송비</div>
                            {product.isSubscription && <div>구독</div>}
                        </div>
                        <div className="info-values">
                            <div>{product.deliveryFee.toLocaleString()}원</div>
                            {product.isSubscription && (
                                <div>{product.subscriptionDiscountRate * 100}% 할인</div>
                            )}
                        </div>
                    </div>

                    {/* 구매 방식 라디오 버튼 */}
                    <div className="purchase-method-box">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="purchase"
                                value="one-time"
                                checked={purchaseType === 'one-time'}
                                onChange={(e) => setPurchaseType(e.target.value)}
                            />
                            <span className="radio-label">1회 구매
                                <span className="price-text">{discountPrice.toLocaleString()}원</span>
                            </span>
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="purchase"
                                value="subscribe"
                                checked={purchaseType === 'subscribe'}
                                onChange={(e) => setPurchaseType(e.target.value)}
                            />
                            <span className="radio-label"> 구독하기
                                <span className="price-text">{subscribePrice.toLocaleString()}원</span>
                            </span>
                            <span className="badge">{product.subscriptionDiscountRate * 100}% 추가할인</span>
                        </label>
                    </div>

                    {/* 구독일 때만 배송주기/구독기간 선택 */}
                    {isSubscribeSelected && (
                        <div className="subscribe-options">

                            {/* 배송주기 */}
                            <div className="form-group">
                                <label htmlFor="delivery-cycle">배송주기</label>
                                <select
                                    id="delivery-cycle"
                                    value={`${deliveryCycle.cycleType}-${deliveryCycle.cycleValue}`}
                                    onChange={(e) => {
                                        const [type, value] = e.target.value.split('-');
                                        setDeliveryCycle({
                                            cycleType: type,
                                            cycleValue: parseInt(value)
                                        });
                                    }}
                                >
                                    <option value="WEEKLY-1">1주</option>
                                    <option value="WEEKLY-2">2주</option>
                                    <option value="MONTHLY-1">1개월</option>
                                </select>
                            </div>

                            {/* 구독기간 */}
                            <div className="form-group">
                                <label htmlFor="delivery-period">구독기간</label>
                                <select
                                    id="delivery-period"
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

                    {/* 수량 선택 */}
                    {/* 총 상품 금액 */}
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

                    {/* 장바구니/구매하기 버튼 */}
                    <div className="purchase-buttons">
                        <button className="cart-button" onClick={handleCart} disabled={user.role === 'SELLER'}>장바구니</button>
                        {isSubscribeSelected ? (
                            <button className="purchase-button" onClick={handleOrder} disabled={user.role === 'SELLER'}>구독하기</button>
                        ) : (
                            <button className="purchase-button" onClick={handleOrder} disabled={user.role === 'SELLER'}>구매하기</button>
                        )}
                    </div>

                </div>
            </div>

            {/* 하단 탭 */}
            <div className="product-detail-tabs">
                <button
                    className={`tab ${activeTab === 'detail' ? 'active' : ''}`}
                    onClick={() => setActiveTab('detail')}
                >
                    상품상세
                </button>

                <button
                    className={`tab ${activeTab === 'review' ? 'active' : ''}`}
                    onClick={() => setActiveTab('review')}
                >
                    리뷰({reviewCount})
                </button>

                <button
                    className={`tab ${activeTab === 'inquiry' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inquiry')}
                >
                    문의({inquiryCount})
                </button>
            </div>

            <div className="product-tab-content">
                {/* 상품상세 탭 */}
                {activeTab === 'detail' && (
                    <div className="detail-content">
                        {/* 상품 상세 설명 */}
                        <h2 className="detail-heading">상품 상세 정보</h2>
                        <p className="detail-text">{product.description}</p>
                        {/* 필요하면 이미지, 사양표 등 추가 */}
                    </div>
                )}

                {/* 리뷰 탭 */}
                {/* ─── 리뷰 탭 ─── */}
                {activeTab === 'review' && (
                    <div className="review-content">
                        {/* ─── 좌우 분할 컨테이너 ─── */}
                        <div className="review-top-container">
                            {/* 좌측: 평균 별점 숫자 + 별 아이콘 */}
                            <div className="review-left">
                                <div className="average-rating-large">
                                    {averageRating.toFixed(2)}
                                </div>
                                <div className="stars-large">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`star ${i < Math.round(averageRating) ? 'filled' : ''}`}
                                        >★</span>
                                    ))}
                                </div>
                            </div>

                            {/* 우측: 평점 분포 가로 막대 */}
                            <div className="review-right">
                                {ratingDistribution.map(({ star, percent, count }) => (
                                    <div key={star} className="dist-row">
                                        <span className="dist-label">{star}점</span>
                                        <div className="dist-bar">
                                            <div
                                                className="dist-fill"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="dist-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* 총개수 + 정렬 */}
                        <div className="review-header">
                            <span className="total-count">총 {reviewCount}개</span>
                            <div className="sort-options">
                                <button
                                    className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                                    onClick={() => setSortBy('rating')}
                                >
                                    별점순
                                </button>
                                <span className="divider">|</span>
                                <button
                                    className={`sort-btn ${sortBy === 'latest' ? 'active' : ''}`}
                                    onClick={() => setSortBy('latest')}
                                >
                                    최신순
                                </button>
                            </div>
                        </div>

                        {/* 실제 리뷰 리스트 */}
                        <ul className="review-list">
                            {sortedReviews.map((r) => (
                                <li key={r.reviewId} className="review-item">
                                    <div className="review-top">
                                        <div className="author-info">
                                            <div className="author-meta">
                                                <span className="author-id">{maskUserId(r.user.userId)}</span>
                                                <span className="date">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* 별점 */}
                                    <div className="rating-stars">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`star-small ${i < r.rating ? 'filled' : ''}`}
                                            >★</span>
                                        ))}
                                    </div>
                                    {/* review 이미지 */}
                                    {r.images.length > 0 && (
                                        <div className="review-images">
                                            {r.images.map((src, idx) => (
                                                <img key={idx} src={src} alt="" />
                                            ))}
                                        </div>
                                    )}
                                    {/* 내용 */}
                                    <p className="review-text">{r.reviewContent}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ─── 문의 탭 ─── */}
                {activeTab === 'inquiry' && (
                    <div className="inquiry-content">

                        {/* 헤더: 제목 + 작성 버튼 */}
                        <div className="inquiry-header">
                            <h2 className="inquiry-heading">문의 ({inquiries.length})</h2>
                            <button
                                className="ask-btn"
                                onClick={handleAskClick}
                                disabled={!user.isLoggedIn || user.role !== 'CONSUMER'}
                            >
                                문의작성
                            </button>
                        </div>

                        {/* 작성 폼 */}
                        {isAskFormVisible && (
                            <div className="inquiry-form">
                                <div className="form-field">
                                    <label>상품명</label>
                                    <input type="text" value={product.productName} disabled />
                                </div>
                                <div className="form-field">
                                    <label>카테고리</label>
                                    <select
                                        value={askCategory}
                                        onChange={e => setAskCategory(e.target.value)}
                                    >
                                        <option value="PRODUCT">상품문의</option>
                                        <option value="DELIVERY">배송문의</option>
                                        <option value="GROUP_BUY">공동구매문의</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>문의내용</label>
                                    <textarea
                                        value={askContent}
                                        onChange={e => setAskContent(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="form-buttons">
                                    <button onClick={handleAskSubmit}>등록하기</button>
                                    <button onClick={() => setIsAskFormVisible(false)}>취소하기</button>
                                </div>
                            </div>
                        )}

                        {/* 문의 리스트 */}
                        <div className="inquiry-list">
                            {sortedInquiries.map(inq => (
                                <div key={inq.inquiryId} className="inquiry-item">
                                    <div className="inquiry-question">
                                        <span className="inquiry-user">{maskUserId(inq.user.userId)}</span>
                                        <span className="inquiry-date">{new Date(inq.createdAt).toLocaleString()}</span>
                                        <p className="inquiry-text">{inq.inquiryContent}</p>
                                    </div>

                                    {/* 판매자용 답변 버튼 (미답변 시) */}
                                    {user.role === 'SELLER' && !inq.answer && (
                                        <button
                                            className="answer-toggle-btn"
                                            onClick={() => toggleAnswerForm(inq.inquiryId)}
                                        >
                                            답변작성
                                        </button>
                                    )}

                                    {/* 답변 폼 */}
                                    {answerFormVisible[inq.inquiryId] && (
                                        <div className="answer-form">
                                            <textarea placeholder="답변 내용을 입력하세요"
                                                      value={answerInputs[inq.inquiryId] || ''}
                                                      onChange={e => handleAnswerChange(inq.inquiryId, e.target.value)}/>
                                            <div className="form-buttons">
                                                <button onClick={() => handleAnswerSubmit(inq.inquiryId)}>
                                                    답변등록
                                                </button>
                                                <button onClick={() => toggleAnswerForm(inq.inquiryId)}>
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* 답변이 달린 경우 */}
                                    {inq.answer && (
                                        <div className="inquiry-answer">
                                            <p className="answer-label">답변</p>
                                            <p className="answer-text">{inq.answer}</p>
                                            <p className="answer-date">
                                                {new Date(inq.answeredAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/*로그인 관련 팝업*/}
            {showLoginPopup && (
                <Popup
                    type="loginRequired"
                    onConfirm={() => {
                        setShowLoginPopup(false);
                        navigate('/login');
                    }}
                    onCancel={() => setShowLoginPopup(false)}
                />
            )}
        </div>
    );
}