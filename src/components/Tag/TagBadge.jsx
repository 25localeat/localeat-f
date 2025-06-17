/*
파일명 : TagBadge.jsx
파일설명 : 뱃지 UI 컴포넌트. 지역 태그, b급상품태그, 공동구매 태그 다 포함.
작성자 : 정여진
기간 : 2025-04-09.
*/
import React from 'react';
import './TagBadge.css';

const TagBadge = ({ label, bg = 'rgba(0,0,0,0.05)', color = '#000' }) => {
    return (
        <div className="tag-badge" style={{ backgroundColor: bg, color }}>
            #{label}
        </div>
    );
};

export default TagBadge;
