import React, {useEffect, useMemo, useState} from 'react';
import ProductMainInfo from './ProductMainInfo';
import TabReview from "./TabReview";
import TabInquiry from "./TabInquiry";
import Popup from '../../components/Ui/Popup/Popup';
import {useNavigate, useParams} from 'react-router-dom';
import './ProductDetail.css'
import axios from "../../components/api/axios";

const ProductDetail = () => {

    const {productId} = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [reviewData, setReviewData] = useState([]);
    const [sortBy, setSortBy] = useState('latest');
    const [inquiries, setInquiries] = useState([]);
    const [wished, setWished] = useState(false);
    const [purchaseType, setPurchaseType] = useState('one-time');
    const [quantity, setQuantity] = useState(1);
    const [deliveryCycle, setDeliveryCycle] = useState({cycleType: 'WEEKLY', cycleValue: 1});
    const [deliveryPeriodInMonths, setDeliveryPeriodInMonths] = useState(1);

    const [popupType, setPopupType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [activeTab, setActiveTab] = useState('detail');

    // imageurl 넘기기
    const imageUrl = useMemo(() => {
        return product?.id
            ? `/api/images/by-product/${product.id}`
            : '/images/default.png';
    }, [product]);

    // 로그인한 사용자 정보 불러오기
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({...parsedUser, isLoggedIn: true});
            } catch (err) {
                console.warn("유저 정보 파싱 실패:", err);
                setUser({isLoggedIn: false});
            }
        } else {
            setUser({isLoggedIn: false});
        }
    }, []);

    // 로그인된 사용자 기준 상품 정보 불러오기
    useEffect(() => {
        if (!productId || !user) return;

        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/products/${productId}`, {
                    params: {userId: user.userId},
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                });

                console.log(" 상품 응답 확인:", res.data);
                setProduct(res.data);

                const wishedValue = typeof res.data === 'object' && ('isWished' in res.data || 'wished' in res.data)
                    ? (res.data.isWished ?? res.data.wished)
                    : false;

                setWished(wishedValue);
            } catch (err) {
                console.error(' 상품 정보 조회 실패:', err);
            }
        };

        fetchProduct();
    }, [productId, user]);

    // 찜 토글 처리
    const handleWishToggle = async () => {
        if (!user.isLoggedIn) {
            setPopupType('loginRequired');
            setShowPopup(true);
            return;
        }

        try {
            const res = await axios.post(`/api/wish/${product.id}`, null, {
                params: {userId: user.userId}
            });

            console.log('찜 처리 응답:', res.data);
            setWished(res.data.wished);
        } catch (err) {
            console.error('찜 처리 실패:', err);
            alert('찜 처리 중 오류가 발생했습니다.');
        }
    };

    // 리뷰 데이터 불러오기
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/api/reviews/product/${productId}`, {
                    params: {
                        sortBy: sortBy,
                        currentUserId: user?.userId
                    }
                });
                setReviewData(res.data);
            } catch (error) {
                console.error("리뷰 불러오기 실패:", error);
            }
        };
        if (productId && user) fetchReviews();
    }, [productId, user, sortBy]);

    // 문의 더미 설정
    useEffect(() => {
        setInquiries([
            {
                inquiryId: 1,
                user: {userId: 'buyer123'},
                createdAt: '2025-04-01T14:30:00',
                category: '배송문의',
                content: '언제쯤 배송되나요?',
                answer: '내일 출고 예정입니다.',
            },
            {
                inquiryId: 2,
                user: {userId: 'moon987'},
                createdAt: '2025-04-03T09:15:00',
                category: '상품문의',
                content: 'B급 상품은 상처가 많이 나 있나요?',
                answer: '',
            },
        ]);
    }, [productId]);


    // 리뷰
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/api/reviews/product/${productId}`, {
                    params: {
                        sortBy: sortBy,
                        currentUserId: user?.userId // 여기 추가입니다.
                    }
                });
                setReviewData(res.data);
            } catch (error) {
                console.error("리뷰 불러오기 실패:", error);
            }
        };
        if (productId && user) fetchReviews();
    }, [productId, user, sortBy]);

    if (!product || !user) return <div>로딩 중...</div>;

    // B급 여부에 따라 1회 구매 단가 결정
    const purchasePrice = product.productGrade === 'B'
        ? Math.floor(product.price * (1 - product.gradeDiscountRate))
        : product.price;


    // 구독 시 할인 적용된 가격
    const subscribePrice = Math.floor(purchasePrice * (1 - product.subscriptionDiscountRate));

    // 수량 적용 총 금액 계산
    const isSubscribeSelected = purchaseType === 'subscribe';
    const finalPrice = isSubscribeSelected
        ? subscribePrice * quantity
        : purchasePrice * quantity;


    const handleCart = async () => {
        if (!user.isLoggedIn) {
            setPopupType('loginRequired');
            setShowPopup(true);
            return;
        }
        try {
            await axios.post('/api/cart', {
                productId: product.id,
                quantity,
                purchaseType,
                ...(purchaseType === 'subscribe' && {
                    deliveryCycle,
                    deliveryPeriodInMonths
                })
            });
            setPopupType('cartAdded');
            setShowPopup(true);
        } catch (err) {
            console.error('장바구니 추가 실패:', err);
            alert('장바구니 담기 중 오류가 발생했습니다.');
        }
    };

    const handleOrder = async () => {
        if (!user.isLoggedIn) {
            setPopupType('loginRequired');
            setShowPopup(true);
            return;
        }

        const calculatedPrice = isSubscribeSelected ? subscribePrice : purchasePrice;

        try {
            await axios.post('/api/orders/single', {
                userId: user.userId,
                productId: product.id,
                quantity,
                price: calculatedPrice  // 최종 가격 전송
            });
            setPopupType('paymentComplete');
            setShowPopup(true);
        } catch (err) {
            console.error('주문 실패:', err);
            alert('주문 중 오류가 발생했습니다.');
        }
    };


    const handleGroupBuy = () => {
        if (!user.isLoggedIn) {
            setPopupType('loginRequired');
            setShowPopup(true);
            return;
        }
        navigate(`/groupBuy/detail?productId=${product.id}`);
    };

    const handlePopupConfirm = () => {
        setShowPopup(false);
        if (popupType === 'loginRequired') navigate('/login');
        else if (popupType === 'cartAdded') {
            if (isSubscribeSelected) navigate('/cart-subscribe');
            else navigate('/cart');
        } else if (popupType === 'paymentComplete') {
            if (isSubscribeSelected) navigate('/mypage/buyer/subscribe');
            else navigate('/mypage/buyer/orders');
        }
    };

    return (
        <div className="product-detail-page">
            <ProductMainInfo
                product={{...product, imageUrl, wished}} // wished 상태를 product에도 반영해줘야 정상 작동.
                user={user}
                isWish={wished}
                onWishToggle={handleWishToggle}
                purchaseType={purchaseType}
                setPurchaseType={setPurchaseType}
                deliveryCycle={deliveryCycle}
                setDeliveryCycle={setDeliveryCycle}
                deliveryPeriodInMonths={deliveryPeriodInMonths}
                setDeliveryPeriodInMonths={setDeliveryPeriodInMonths}
                quantity={quantity}
                setQuantity={setQuantity}
                finalPrice={finalPrice}
                subscribePrice={subscribePrice}
                purchasePrice={purchasePrice}
                onCart={handleCart}
                onOrder={handleOrder}
                onGroupBuy={handleGroupBuy}
            />

            {/* 하단 탭 버튼 */}
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
                    리뷰
                </button>

                <button
                    className={`tab ${activeTab === 'inquiry' ? 'active' : ''}`}
                    onClick={() => setActiveTab('inquiry')}
                >
                    문의
                </button>
            </div>

            {/* 하단 탭 내용 */}
            <div className="product-tab-content">
                {activeTab === 'detail' && (
                    <div>
                        <h2 className="detail-heading">상품 상세 정보</h2>
                        <p className="detail-text">{product.description}</p>
                    </div>
                )}

                {activeTab === 'review' && (
                    <TabReview
                        reviewData={reviewData}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                )}

                {activeTab === 'inquiry' && (
                    <TabInquiry inquiries={inquiries} user={user} setInquiries={setInquiries}/>
                )}

            </div>

            {showPopup && (
                <Popup
                    type={popupType}
                    onConfirm={handlePopupConfirm}
                    onCancel={() => setShowPopup(false)}
                />
            )}
        </div>
    );
};


export default ProductDetail;
