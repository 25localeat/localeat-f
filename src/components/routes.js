/*
파일명  : routes.js
파일설명 : App.js에서는 사용하지 않고,
           다른 컴포넌트 파일에서 navigate()나 Link 이동 시
           경로를 통일하기 위해 사용하는 공용 상수 파일입니다. 여기 밑에다 추가해주세요.
// 작성자  : 정여진
// 작성일  : 2025-04-26.~
*/
export const ROUTES = {
    HOME: '/',
    SEARCH: '/search',
    PRODUCT_DETAIL: '/product/:id',
};