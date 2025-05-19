/*
파일명 : FloatingButton.jsx
파일설명 : 화면 우측 하단에 고정된 ‘알뜰상품 바로가기’ 버튼 컴포넌트
작성자 : 정여진
기간 : 2025-04-10.~
*/
import './FloatingButton.css';

const FloatingButton = ({ onClick }) => {
    return (
        <button onClick={() => onClick('B')} className="floating-button">
            B급 상품 보기
        </button>
    );
};

export default FloatingButton;