/**
 * 파일명 :addToSubscribeCart.js
 * 설명 : 구독 상품을 장바구니에 담을 때 호출하는 API 요청 함수입니다.
 * 작성자 : 정여진
 * 작성일 : 2025.05.26.
 * */
import api from './axios';

/**
 * 구독 장바구니에 상품 추가 요청
 * @param {Object} params - 장바구니 담기 요청 정보
 * @param {number} params.productId - 상품 ID
 * @param {number} params.quantity - 수량
 * @param {number} params.price - 단가 (구독 할인 적용된 가격)
 * @param {Object} params.deliveryCycle - 배송 주기 (예: { cycleType: 'MONTHLY', cycleValue: 1 })
 * @param {number} params.deliveryPeriodInMonths - 구독 기간 (단위: 개월)
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const addToSubscribeCart = async ({
                                             productId,
                                             quantity,
                                             price,
                                             deliveryCycle,
                                             deliveryPeriodInMonths
                                         }) => {
    const userId = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).userId
        : undefined;

    const response = await api.post('/api/cart/subscribe/items', {
        productId,
        quantity,
        price,
        purchaseType: 'subscribe',
        deliveryCycle,
        deliveryPeriodInMonths
    }, {
        headers: { userId }
    });

    return response.data;
};