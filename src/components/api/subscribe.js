/**
 * 파일명 :createSubscribeOrder.js
 * 설명 : 구독 주문 API 요청 모듈
 * 작성자 : 정여진
 * 작성일 : 2025.05.26.
 * */
import api from './axios';  // 공통 axios 인스턴스

/**
 * 구독 주문 생성 요청
 * @param {Object} params - 구독 주문 정보
 * @param {number} params.productId - 주문할 상품 ID
 * @param {number} params.quantity - 주문 수량
 * @param {Object} params.deliveryCycle - 배송 주기 정보 (예: { cycleType: 'WEEKLY', cycleValue: 1 })
 * @param {number} params.deliveryPeriodInMonths - 구독 총 기간 (단위: 개월)
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const createSubscribeOrder = async ({ productId, quantity, deliveryCycle, deliveryPeriodInMonths }) => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.userId;

    if (!userId) throw new Error("userId가 없습니다");

    const payload = {
        productId,
        quantity,
        deliveryCycle,
        deliveryPeriodInMonths
    };

    // POST 요청 + userId는 Header에 포함
    const response = await api.post('/api/subscribe-order', payload, {
        headers: {
            'Content-Type': 'application/json',
            'userId': userId
        }
    });

    return response.data;
};
