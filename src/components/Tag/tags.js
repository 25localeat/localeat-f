/*
파일명  : tags.js
파일설명 : 모든 태그(label)의 타입, 배경색(bg), 글자색(color) 정보를 한번에 관리
        지역 태그, 공동구매 태그, b급상품 태그 전부 포함
작성자  : 정여진
작성일  : 2025-04-09.
*/

const tags = [
    // 지역 태그
    { type: 'region', label: '서울/경기/인천', code: 'SGI', bg: 'rgba(171, 78, 82, 0.1)', color: '#AB4E52' },
    { type: 'region', label: '강원', code: 'GANGWON', bg: 'rgba(244, 166, 136, 0.1)', color: '#F4A688' },
    { type: 'region', label: '충청', code: 'CHUNGCHEONG', bg: 'rgba(110, 75, 53, 0.1)', color: '#6E4B35' },
    { type: 'region', label: '전북',code: 'JEONBUK', bg: 'rgba(164, 215, 146, 0.1)', color: '#A4D792' },
    { type: 'region', label: '전남/광주',code: 'JNGJ', bg: 'rgba(0, 178, 169, 0.1)', color: '#00B2A9' },
    { type: 'region', label: '대구/경북',code: 'DGGB', bg: 'rgba(116, 139, 171, 0.1)', color: '#748BAB' },
    { type: 'region', label: '경남/부산/울산', code: 'GNBNUL',bg: 'rgba(208, 176, 132, 0.1)', color: '#D0B084' },
    { type: 'region', label: '제주', code: 'JEJU',bg: 'rgba(189, 160, 203, 0.1)', color: '#BDA0CB' },

    // 🏷상품 등급 태그
    { type: 'grade', label: 'GOOD', code: 'B', bg: 'rgba(255, 118, 152, 0.10)', color: '#FF7698' },
    { type: 'grade', label: 'EXCELLENT', code: 'A', bg: 'rgba(255, 216, 0, 0.10)', color: '#FFD600' },

    // 공동구매 태그
    { type: 'etc', label: '공동구매', code: "GROUP_BUY",  bg: 'rgba(190, 190, 190, 0.10)', color: '#999999' },
];

export default tags;

/**
 * label 값으로 해당 태그 정보 가져오기
 * @param {string} label - 태그 라벨 텍스트 (예: "강원", "GOOD")
 * @returns 태그 객체 (bg, color 포함), 없을 경우 기본값 반환
 */
export const getTagByLabel = (label) => {
    return (
        tags.find((tag) => tag.label === label) || {
            label,
            type: 'custom',
            bg: 'rgba(0, 0, 0, 0.05)',
            color: '#000',
        }
    );
};

export const getTagByCode = (code) => {
    return (
        tags.find((tag) => tag.code === code) || {
            label: code,
            type: 'custom',
            bg: 'rgba(0, 0, 0, 0.05)',
            color: '#000',
        }
    );
};

export const getTagsByType = (type) => tags.filter((tag) => tag.type === type);

