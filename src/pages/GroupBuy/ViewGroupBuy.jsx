/*
파일명: ViewGroupBuy.css
파일 설명: 로컬잇 공동구매 전체 보기 페이지
작성자: 김미현
기간: 2025-04-28 ~
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './ViewGroupBuy.css'
import carrotImg from './carrot.png';

const product = {
    product_id : 1,
    image: carrotImg,
    location:  "서울/인천/경기",
    product_name : "당근"
   };


const groupBuyList = [
    {
        groupBuyId : 1,
        location : "서울/인천/경기",
        product_name : "당근",
        max_parti : 20,
        parti_count : 8
    },
    {
            groupBuyId : 2,
            location : "서울/경기/인천",
            product_name : "당근",
            max_parti : 20,
            parti_count : 11
    }
];

const ViewGroupBuy = () => {
    return (
        <div className="container">
            <p className="title">공동 구매</p>
            <div className="groupBuy-box">
                <div className = "header-section">
                    <div className="img-wrapper">
                        <img className="product-image" src={product.image} alt="당근"/>
                    </div>
                    <div className="product-info">
                        <div className="top-row">
                            <p className="product-name">{product.product_name}</p>
                            <Link to="/groupBuy/create">
                                <button className="create-button">공동구매 만들기</button>
                            </Link>
                        </div>
                        <p className="groupBuy-guide">현재 상품에 대한 공동구매 진행 건은 다음과 같습니다.</p>
                    </div>
                </div>

                <hr className="divider" />

                <div className="list-wrapper">
                    {groupBuyList.map((item) => (
                        <div key={item.groupBuyId} className="list">
                            <p className="list-text">
                                지역: {item.location} 상품명: {item.product_name} 모집인원 {item.parti_count}/{item.max_parti}
                            </p>
                            <Link to="/groupBuy/join">
                                <button className="join-button">참여하기</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewGroupBuy;