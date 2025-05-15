import React, {useEffect, useMemo, useState} from 'react';
import ProductMainInfo from './ProductMainInfo';
import TabReview from "./TabReview";
import TabInquiry from "./TabInquiry";
import tomatoImg from './tomato.png';
import Popup from '../../components/Ui/Popup/Popup';
import {useNavigate, useParams} from 'react-router-dom';
import './ProductDetail.css'
import axios from "../../components/api/axios";

const ProductDetail = () => {

    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [reviewData, setReviewData] = useState([]);
    const [sortBy, setSortBy] = useState('latest');
    const [inquiries, setInquiries] = useState([]);
    const [isWish, setIsWish] = useState(false);
    const [purchaseType, setPurchaseType] = useState('one-time');
    const [quantity, setQuantity] = useState(1);
    const [deliveryCycle, setDeliveryCycle] = useState({ cycleType: 'WEEKLY', cycleValue: 1 });
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


    useEffect(() => {
            const fetchProduct = async () => {
                try {
                    const res = await axios.get(`/api/products/${productId}`);
                    setProduct(res.data);
                } catch (err) {
                    console.error('상품 정보를 불러오는데 실패했습니다.', err);
                }
            };

            if (productId) fetchProduct();

        setUser({
            isLoggedIn: true,
            role: 'SELLER', //  CONSUMER
            userId: 'testUser',
        });
        setInquiries([
            {
                inquiryId: 1,
                user: { userId: 'buyer123' },
                createdAt: '2025-04-01T14:30:00',
                category: '배송문의',
                content: '언제쯤 배송되나요?',
                answer: '내일 출고 예정입니다.',
            },
            {
                inquiryId: 2,
                user: { userId: 'moon987' },
                createdAt: '2025-04-03T09:15:00',
                category: '상품문의',
                content: 'B급 상품은 상처가 많이 나 있나요?',
                answer: '',
            },
        ]);

    }, [productId]);

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

    if (!product || !user) return <div>로딩 중...</div>;

    // 1회 구매 시 적용되는 실제 가격 (B급은 10% 할인, A급은 그대로)
    const purchasePrice = product.productgrade === 'B'
        ? Math.floor(product.price * (1 - product.grade_discount_rate))
        : product.price;


    // 구독 시 할인 적용된 가격
    const subscribePrice = Math.floor(purchasePrice * (1 - product.subscriptionDiscountRate));

    // 수량을 고려한 총 금액
    const isSubscribeSelected = purchaseType === 'subscribe';
    const finalPrice = isSubscribeSelected
        ? subscribePrice * quantity
        : purchasePrice * quantity;

    const handleWishToggle = () => {
        if (!user.isLoggedIn) {
            setPopupType('loginRequired');
            setShowPopup(true);
            return;
        }
        setIsWish(prev => !prev);
    };

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
        try {
            await axios.post('/api/orders', {
                productId: product.id,
                quantity,
                purchaseType,
                ...(purchaseType === 'subscribe' && {
                    deliveryCycle,
                    deliveryPeriodInMonths
                })
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
                product={{ ...product, imageUrl }}
                user={user}
                isWish={isWish}
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
                    <TabInquiry inquiries={inquiries} user={user} setInquiries={setInquiries} />
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
